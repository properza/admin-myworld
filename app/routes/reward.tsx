import { MetaFunction } from "@remix-run/node";
import { useLocation } from "@remix-run/react";

import Layout from "~/components/Layout";

export const meta: MetaFunction = () => [{ title: "My Beer | Product Reward" }];

export default function Reward (): JSX.Element {
  const location = useLocation();

  return (
    <Layout title="Reward" pathname={location.pathname}>
      <h1>Reward</h1>
    </Layout>
  )
}
