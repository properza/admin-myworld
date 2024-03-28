import bcrypt from "bcryptjs";

import config from "~/config";
import { constructURL } from "~/utils";

export interface UserMetadata {
  currentPage: number;
  perPage: number;
  totalPage: number;
  totalRow: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
}

export interface UserWithCredentials extends User {
  accessToken: string;
  refreshToken: string;
}

export interface CreateUserProps {
  username: string;
  password: string;
  email: string;
  phone: string;
}

export interface UserResponse extends UserMetadata {
  data: UserData[];
}

export interface UserData {
  admin_id: string;
  name: string;
  phone: string;
  email: string;
  can_delete: boolean;
  created_at: string;
}

export async function getUsers(accessToken: string): Promise<UserResponse> {
  const response = await fetch(constructURL(config.api.baseUrl, `/admins`), {
    headers: { Authorization: "Bearer " + accessToken },
  });

  const user = await response.json();
  return user;
}

export async function getUserById(
  userId: string,
  accessToken: string,
): Promise<User | undefined> {
  const response = await fetch(
    constructURL(config.api.baseUrl, `/admins/${userId}`),
    {
      headers: { Authorization: "Bearer " + accessToken },
    },
  );
  const user = await response.json();

  return {
    id: user.admin_id,
    username: user.name,
    email: user.email,
    phone: user.phone,
  };
}

export async function createUser(
  user: CreateUserProps,
  accessToken: string,
): Promise<string> {
  const hashedPassword = await bcrypt.hash(user.password, 10);

  const response = await fetch(
    constructURL(config.api.baseUrl, "/admins/createAdmin"),
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: user.username,
        password: hashedPassword,
        email: user.email,
        phone: user.phone,
      }),
    },
  );

  return await response.json();
}

export async function verifyLogin(
  username: string,
  password: string,
): Promise<UserWithCredentials | undefined | null> {
  const response = await fetch(
    constructURL(config.api.baseUrl, "/admins/login"),
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: username, password }),
    },
  );

  const user = await response.json();

  if (!user) return null;

  return {
    id: user.admin_id,
    username: user.name,
    email: user.email,
    phone: user.phone,
    accessToken: user.access_token,
    refreshToken: user.refresh_token,
  };
}

export async function renewAccessToken(
  refreshToken: string,
): Promise<{ newAccessToken: string }> {
  const response = await fetch(
    constructURL(config.api.baseUrl, "/admins/refreshToken"),
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    },
  );

  const tokens = await response.json();

  console.log(tokens);

  return { newAccessToken: tokens.access_token };
}

export async function performLogout(accessToken: string): Promise<string> {
  const response = await fetch(
    constructURL(config.api.baseUrl, "/admins/logout"),
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const message = await response.text();
  return message;
}
