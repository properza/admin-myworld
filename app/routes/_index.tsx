import { LoaderFunctionArgs, redirect } from "@remix-run/node";

import { getUserId } from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/customers");
  return redirect("/login");
};
