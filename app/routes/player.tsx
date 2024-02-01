import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { useLocation } from "@remix-run/react";

import Layout from "~/components/Layout";
import { getUserData, requireUserId } from "~/services/session.server";

export const meta: MetaFunction = () => [{ title: "My Beer | Player" }];

export default function Player(): JSX.Element {
	const location = useLocation();

	return (
		<Layout title="Player" pathname={location.pathname}>
			<h1>Player</h1>
		</Layout>
	);
}
