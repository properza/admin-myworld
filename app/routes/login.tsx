import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

import { verifyLogin } from "~/models/user.server";
import { createUserSession, getUserId } from "~/services/session.server";
import { classNames } from "~/tailwind";
import { safeRedirect } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/customers");
  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const username = formData.get("username");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

  if (!username || typeof username !== "string" || username.length === 0) {
    return json(
      {
        errors: {
          auth: null,
          username: "Username is required",
          password: null,
        },
      },
      { status: 400 },
    );
  }

  if (!password || typeof password !== "string" || password.length === 0) {
    return json(
      {
        errors: {
          auth: null,
          username: null,
          password: "Password is required",
        },
      },
      { status: 400 },
    );
  }

  const user = await verifyLogin(username, password);

  if (!user?.id) {
    return json(
      {
        errors: {
          auth: "Invalid username or password",
          username: null,
          password: null,
        },
      },
      { status: 400 },
    );
  }

  if (user && (!user.id || !user.accessToken || !user.refreshToken)) {
    return json(
      {
        errors: {
          auth: "Authentication failed. Please try again!",
          username: null,
          password: null,
        },
      },
      { status: 400 },
    );
  }

  return createUserSession({
    request,
    redirectTo,
    userId: user.id,
    accessToken: user.accessToken,
    refreshToken: user.refreshToken,
  });
};

export const meta: MetaFunction = () => [{ title: "Login" }];

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/customers";
  const submit = useSubmit();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const actionData = useActionData<typeof action>();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.username) {
      usernameRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      submit(e.currentTarget, { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center bg-cover bg-center bg-no-repeat bg-[url('/images/login-background.svg')]">
      <div className="mx-auto w-full max-w-md px-8">
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-4">
            <img
              src="/images/brand-logo.svg"
              alt="My Beer Logo"
              draggable="false"
            />
          </div>

          <h1 className="text-2xl font-kanit font-semibold text-blackrose">
            My Beer Back Office
          </h1>
        </div>

        <div className="bg-white p-8 rounded-2xl">
          <Form method="post" onSubmit={handleFormSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-blackrose"
              >
                Username
              </label>
              <div className="mt-1">
                <input
                  ref={usernameRef}
                  id="username"
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus={true}
                  name="username"
                  type="text"
                  autoComplete="username"
                  aria-invalid={actionData?.errors?.username ? true : undefined}
                  aria-describedby="username-error"
                  className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                />
                {actionData?.errors?.username ? (
                  <div className="pt-1 text-red-700" id="username-error">
                    {actionData.errors.username}
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-blackrose"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  ref={passwordRef}
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  aria-invalid={actionData?.errors?.password ? true : undefined}
                  aria-describedby="password-error"
                  className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                />

                {actionData?.errors?.auth ? (
                  <div className="pt-1 text-red-700" id="username-error">
                    {actionData.errors.auth}
                  </div>
                ) : null}

                {actionData?.errors?.password ? (
                  <div className="pt-1 text-red-700" id="password-error">
                    {actionData.errors.password}
                  </div>
                ) : null}
              </div>
            </div>

            <input type="hidden" name="redirectTo" value={redirectTo} />

            <button
              type="submit"
              className={classNames(
                isLoading ? "opacity-50 cursor-not-allowed" : "",
                "w-full rounded bg-charged-blue px-4 py-2 font-kanit text-white font-medium hover:bg-cyan-600 focus:bg-cyan-500",
              )}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}
