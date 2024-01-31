import {
	MetaFunction,
	json,
	redirect,
	LoaderFunctionArgs,
} from "@remix-run/node";
import { useLoaderData, useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";
import invariant from "tiny-invariant";
import CustomerDetailsCard from "~/components/CustomerDetailsCard";
import CustomerTradeDetailsCard from "~/components/CustomerTradeDetailsCard";
import CustomTradesDetailsTable from "~/components/CustomTradesDetailsTable";
import Layout from "~/components/Layout";
import { Customer } from "~/models/customer.server";
import { getTradesDetail, TradesDetail } from "~/models/trade.server";
import { getUserData, requireUserId } from "~/services/session.server";

export const meta: MetaFunction = () => [{ title: "My Beer | Trade" }];

// const mockCustomer: Customer = {
//   customer_id: "123",
//   name: "John Doe",
//   phone: "555-1234",
//   email: "john.doe@example.com",
//   picture: "https://picsum.photos/200/300",
//   point: 1000,
//   game_point: 500,
//   order: [],
//   trade: [],
//   created_at: "2024-01-25T12:00:00Z",
//   updated_at: "2024-01-25T14:30:00Z",
// };

// const mockTradeInfo = {
//   tradeId: "TRADE123",
//   tradedAt: "12/04/2023 - 13:29",
// };

// const mockTradeList = [
//   {
//     itemNo: 1,
//     merchandiseName: "Product A",
//     merchandiseImageUrl: "https://picsum.photos/200/300",
//     amount: 10,
//     tradeStatus: "pending",
//     shipmentStatus: "pending",
//     totalPointUsed: "50.90"
//   },
//   {
//     itemNo: 2,
//     merchandiseName: "Product A",
//     merchandiseImageUrl: "https://picsum.photos/200/300",
//     amount: 10,
//     tradeStatus: "pending",
//     shipmentStatus: "pending",
//     totalPointUsed: "30.90"
//   }
// ]

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	await requireUserId(request);
	const { accessToken } = await getUserData(request);
	invariant(params.tradesId, "tradeId is required");
	const pathname = new URL(request.url).pathname;

	if (!pathname.endsWith("detail")) {
		return redirect(`/trades`);
	}

	const tradesDetail = await getTradesDetail(accessToken, params.tradesId);
	return json({ tradesDetail });
};

export default function Redeem(): JSX.Element {
	const location = useLocation();
	const { tradesDetail } = useLoaderData<typeof loader>();

	const [tradeDetailData, setTradeDetailData] = useState<TradesDetail>();

	useEffect(() => {
		console.log(tradeDetailData);
		// Update trade detail data when tradesDetail changes
		if (tradesDetail) {
			// Assuming tradesDetail.data is of type TradesDetail
			setTradeDetailData(tradesDetail as TradesDetail);
		} else {
			setTradeDetailData(undefined); // Reset tradeDetailData if tradesDetail or tradesDetail.data is not present
		}
	}, [tradesDetail]);

	return (
		<Layout
			title="รายละเอียดการแลกซื้อ"
			isSubRoute={false}
			returnRoute=""
			pathname={location.pathname}
		>
			<div className="space-y-4">
				{/* Render components conditionally */}
				{tradeDetailData ? (
					<>
						<CustomerTradeDetailsCard
							tradeDetail={tradeDetailData}
							showShippingIinfo={true}
						/>
						<CustomTradesDetailsTable TradeDetail={tradeDetailData} />
					</>
				) : (
					<div>Loading...</div> // You can render a loading indicator here if needed
				)}
			</div>
		</Layout>
	);
}
