import { MetaFunction } from "@remix-run/node";
import { useLocation } from "@remix-run/react";

import Layout from "~/components/Layout";

export const meta: MetaFunction = () => [{ title: "My Beer | Settings" }];

export default function Settings (): JSX.Element {
  const location = useLocation();

  return (
    <Layout title="Settings" pathname={location.pathname}>
      <h1>Settings</h1>
    </Layout>
  )
}
