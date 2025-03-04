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
import config from "~/config";
import { Customer } from "~/models/customer.server";
import { getTradesDetail, TradesDetail } from "~/models/trade.server";
import { getUserData, requireUserId } from "~/services/session.server";
import { constructURL } from "~/utils";

export const meta: MetaFunction = () => [{ title: "My Beer | Trade" }];

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
    if (!response.ok) {
      console.log(await response.json());
      throw new Error();
    }
    return json({ success: 1 });
  } catch (error) {
    console.log(error);
    return json({ error: "error has occured" }, { status: 400 });
  }
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
