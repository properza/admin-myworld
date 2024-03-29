import { Button } from "@material-ui/core";
import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { useLoaderData, useLocation, useSearchParams } from "@remix-run/react";
import { format } from "date-fns";
import { useState, useMemo, useEffect } from "react";

import Layout from "~/components/Layout";
import TradeListTable from "~/components/TradeListTable";
import StockPopup from "~/components/StockModal";
import {
  getStockHistory,
} from "~/models/stock.server";
import { getUserData, requireUserId } from "~/services/session.server";
import HistoryTable from "~/components/HistoryTable";
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);

  const { accessToken } = await getUserData(request);
  const { searchParams } = new URL(request.url);

  const page = searchParams.get("page");
  const filter = searchParams.get("filter");
  const startAt = searchParams.get("startAt");
  const endAt = searchParams.get("endAt");
  const orders = await getStockHistory(accessToken, {
    page,
    search: filter,
    startAt,
    endAt,
  });

  return json({ orders, accessToken });
};

export const meta: MetaFunction = () => [{ title: "My Beer | History" }];

function StoreHistory(): JSX.Element {
  const location = useLocation();
  const [filter, setFilter] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { orders, accessToken } = useLoaderData<typeof loader>();


  return (
    <Layout
      title="History"
      isSubRoute={false}
      returnRoute=""
      pathname={location.pathname}
    >
      <HistoryTable
        data={{
          currentPage: 1,
          perPage: 10,
          totalPage: 1,
          totalRow: 0,
          data: orders.data,
        }}
        filter={filter}
        setFilter={setFilter}
        accessToken={accessToken}
      />
    </Layout>
  );
}

export default StoreHistory;
