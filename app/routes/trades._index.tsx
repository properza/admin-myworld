import { MetaFunction , json } from "@remix-run/node";
import { useLocation, useSearchParams ,useLoaderData } from "@remix-run/react";
import { request } from "http";
import { useEffect, useMemo, useState } from "react";
import { LoaderFunctionArgs } from "react-router";

import Layout from "~/components/Layout";
import TradeTable from "~/components/TradeTable";
import {getTrades, Trades, TradesWithItemNo, TradeMetadata } from "~/models/trade.server";
import { getUserData, requireUserId } from "~/services/session.server";

export const meta: MetaFunction = () => [{ title: "My Beer | Trade" }];


export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);

  const { accessToken } = await getUserData(request);
  const { searchParams } = new URL(request.url);

  const filter = searchParams.get("filter");

  const trades = await getTrades(accessToken, { search: filter, perPage: 10 });

  return json({ trades });
};

export default function Redeem (): JSX.Element {
  const { trades } = useLoaderData<typeof loader>();
  const [tradeData, setTradeData] = useState<TradesWithItemNo[]>([]);
  const [tradeMetadata, setTradeMetadata] = useState<TradeMetadata>({ currentPage: 0, perPage: 0, totalPage: 0, totalRow: 0 });
  const [filterQuery, setFilterQuery] = useState<string>("");
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();


  useMemo(() => {
    if (trades && trades.data) {
      setTradeMetadata({
        currentPage: trades.currentPage,
        totalPage: trades.totalPage,
        totalRow: trades.totalRow,
        perPage: trades.perPage
      });

      const data: TradesWithItemNo[] = trades.data.map(( trade, index) => ({
        ...trade,
        itemNo: (trades.currentPage - 1) * trades.perPage + index + 1
      }));

      setTradeData(data);

    } else {
      setTradeMetadata({ currentPage: 0, totalPage: 0, totalRow: 0, perPage: 0 });
      setTradeData([]);
    }
  }, [trades]);

  useEffect(() => {
    setSearchParams((prev) => {
      filterQuery ? prev.set("filter", filterQuery) : prev.delete("filter");
      return prev;
    },
    { preventScrollReset: true });
  }, [filterQuery]);

  return (
    <Layout title="แลกซื้อสินค้า" isSubRoute={false} returnRoute="" pathname={location.pathname}>
      <TradeTable 
        data={{ ...tradeMetadata, data: tradeData }}
       filter={filterQuery}
       setFilter={setFilterQuery}
        />
    </Layout>
  )
}
