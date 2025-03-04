// In routes/setboxes/$userId.tsx
import { json, LoaderFunction } from "@remix-run/node";
import { getCustomerReedeem } from "~/models/setbox.server";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import SetboxDetail from "~/components/SetboxDetail"; // The component we just created
import Layout from "~/components/Layout";
import { getUserData, requireUserId } from "~/services/session.server";

// In routes/setboxes/$userId.tsx
export const loader: LoaderFunction = async ({ request, params }) => {
    await requireUserId(request);
    const { accessToken } = await getUserData(request);
    const { userId } = params;
    if (!userId) {
      throw new Error("User ID not provided");
    }
    const setboxData = await getCustomerReedeem(accessToken, userId); // Ensure this is correct
    return json(setboxData);
  };
  

export default function SetboxDetailPage({ accessToken }: { accessToken: string }) {
    const location = useLocation();
    return (
        <Layout
            title="Setboxes Details"
            isSubRoute={true}
            returnRoute="/setboxs"
            pathname={location.pathname}
        >
            <SetboxDetail accessToken={accessToken} />
        </Layout>
    );
}
