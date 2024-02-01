import { ActionFunctionArgs, MetaFunction, json } from "@remix-run/node";
import {
	useLocation,
	useSearchParams,
	useLoaderData,
	useSubmit,
} from "@remix-run/react";
import { request } from "http";
import { useEffect, useMemo, useState } from "react";
import { LoaderFunctionArgs } from "react-router";

import Layout from "~/components/Layout";
import TradeTable from "~/components/TradeTable";
import config from "~/config";
import {
	getTrades,
	Trades,
	TradesWithItemNo,
	TradeMetadata,
} from "~/models/trade.server";
import { getUserData, requireUserId } from "~/services/session.server";
import { constructURL } from "~/utils";

export const meta: MetaFunction = () => [{ title: "My Beer | Trade" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
	await requireUserId(request);

	const { accessToken } = await getUserData(request);
	const { searchParams } = new URL(request.url);

	const filter = searchParams.get("filter");

	const trades = await getTrades(accessToken, { search: filter, perPage: 10 });

	return json({ trades });
};

export const action = async ({ request }: ActionFunctionArgs) => {
	await requireUserId(request);
	const formData = await request.formData();

	await requireUserId(request);

	const { accessToken } = await getUserData(request);

	const id = formData.get("id");
	const approve_status = formData.get("approve_status");
	const shipment_status = formData.get("shipment_status");
	try {
		const response = await fetch(
			constructURL(config.api.baseUrl, `trades/${id}/status`),
			{
				method: "PUT",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					approve_status: approve_status || undefined,
					shipment_status: shipment_status || undefined,
				}),
			},
		);
		if (!response.ok) throw new Error("error has occured");
		return json({ success: 1 });
	} catch (error) {
		console.log(error);
		return json({ error: "error has occured" }, { status: 400 });
	}
};

export default function Redeem(): JSX.Element {
	const { trades } = useLoaderData<typeof loader>();
	const [tradeData, setTradeData] = useState<TradesWithItemNo[]>([]);
	const [tradeMetadata, setTradeMetadata] = useState<TradeMetadata>({
		currentPage: 0,
		perPage: 0,
		totalPage: 0,
		totalRow: 0,
	});
	const [filterQuery, setFilterQuery] = useState<string>("");
	const [searchParams, setSearchParams] = useSearchParams();
	const location = useLocation();

	useMemo(() => {
		if (trades && trades.data) {
			setTradeMetadata({
				currentPage: trades.currentPage,
				totalPage: trades.totalPage,
				totalRow: trades.totalRow,
				perPage: trades.perPage,
			});

			const data: TradesWithItemNo[] = trades.data.map((trade, index) => ({
				...trade,
				itemNo: (trades.currentPage - 1) * trades.perPage + index + 1,
			}));

			setTradeData(data);
		} else {
			setTradeMetadata({
				currentPage: 0,
				totalPage: 0,
				totalRow: 0,
				perPage: 0,
			});
			setTradeData([]);
		}
	}, [trades]);

	useEffect(() => {
		setSearchParams(
			(prev) => {
				filterQuery ? prev.set("filter", filterQuery) : prev.delete("filter");
				return prev;
			},
			{ preventScrollReset: true },
		);
	}, [filterQuery]);

	return (
		<Layout
			title="แลกซื้อสินค้า"
			isSubRoute={false}
			returnRoute=""
			pathname={location.pathname}
		>
			<TradeTable
				data={{ ...tradeMetadata, data: tradeData }}
				filter={filterQuery}
				setFilter={setFilterQuery}
			/>
		</Layout>
	);
}
