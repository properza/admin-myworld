import { createCookieSessionStorage, redirect, Session, SessionData } from "@remix-run/node";
import { jwtDecode } from "jwt-decode";

import config from "~/config";
import { getUserById, performLogout, renewAccessToken } from "~/models/user.server";

const USER_SESSION_KEY = "userId";
const USER_ACCESS_TOKEN = "token";
const USER_REFRESH_TOKEN = "refreshToken";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [config.sessionSecret],
    secure: config.environment === "production",
  },
});

async function getSession (request: Request): Promise<Session<SessionData, SessionData>> {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function getUserId (request: Request): Promise<string| null | undefined> {
  const session = await getSession(request);
  const userId = session.get(USER_SESSION_KEY);
  return userId;
}

export async function getUserData (request: Request): Promise<{ userId: string, accessToken: string, refreshToken: string }> {
  const session = await getSession(request);

  const userId = session.get(USER_SESSION_KEY);
  const accessToken = session.get(USER_ACCESS_TOKEN);
  const refreshToken = session.get(USER_REFRESH_TOKEN);

  return { userId, accessToken, refreshToken };
}

export async function getUser (request: Request) {
  const { userId, accessToken, refreshToken } = await getUserData(request);

  if (!userId || !accessToken || !refreshToken) return null;

  const user = await getUserById(userId, accessToken);

  if (user && user.id) return user;

  // if (isTokenExpired(accessToken)) {
  //   await renewSession({ request, userId, refreshToken });

  //   return getUser(request);
  // }

  throw await logout(request);
}

export async function requireUserId (
  request: Request,
  redirectTo: string = new URL(request.url).pathname,
) {
  const userId = await getUserId(request);

  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function requireUser (request: Request) {
  const userId = await requireUserId(request);
  const { accessToken } = await getUserData(request);

  const user = await getUserById(userId, accessToken);

  if (user && user.id) return user;

  // if (isTokenExpired(accessToken)) {
  //   await renewSession({ request, userId, refreshToken });

  //   return requireUser(request);
  // }

  throw await logout(request);
}

export async function createUserSession({
  request,
  userId,
  accessToken,
  refreshToken,
  redirectTo,
}: {
  request: Request;
  userId: string;
  accessToken: string;
  refreshToken: string
  redirectTo: string;
}) {
  const session = await getSession(request);

  session.set(USER_SESSION_KEY, userId);
  session.set(USER_ACCESS_TOKEN, accessToken);
  session.set(USER_REFRESH_TOKEN, refreshToken);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: config.cookieMaxAge
      }),
    },
  });
}

export async function updateUserSession ({
  request,
  userId,
  accessToken,
  refreshToken,
  redirectTo
}: {
  request: Request;
  userId: string;
  accessToken: string;
  refreshToken: string
  redirectTo: string;
}) {
  const session = await getSession(request);

  session.set("userId", userId);
  session.set("token", accessToken);
  session.set("refreshToken", refreshToken);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: config.cookieMaxAge
      }),
    },
  });
}

export async function logout (request: Request) {
  const session = await getSession(request);
  const accessToken = session.get(USER_ACCESS_TOKEN);

  if (accessToken) {
    performLogout(accessToken);
  }

  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

export function isTokenExpired (token: string): boolean {
  const decodedToken = jwtDecode(token);

  if (!decodedToken || !decodedToken.exp) {
    return true;
  }

  const currentTimestamp = Math.floor(Date.now() / 1000);
  return currentTimestamp >= decodedToken.exp
}

export async function renewSession ({
  request,
  userId,
  refreshToken
}: {
  request: Request
  userId: string
  refreshToken: string
}): Promise<void> {
  const { newAccessToken } = await renewAccessToken(refreshToken);

  updateUserSession({
    request,
    userId,
    accessToken: newAccessToken,
    refreshToken,
    redirectTo: "/"
  })
}
