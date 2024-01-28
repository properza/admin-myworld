import { MetaFunction , json } from "@remix-run/node";
import { useLocation, useSearchParams } from "@remix-run/react";
import { request } from "http";
import { useEffect, useMemo, useState } from "react";
import { LoaderFunctionArgs, useLoaderData } from "react-router";

import Layout from "~/components/Layout";
import TradeTable from "~/components/TradeTable";
import {TradeDetail, TradeMetadata } from "~/models/trade.server";

export const meta: MetaFunction = () => [{ title: "My Beer | Trade" }];

let mockupTrades = {
  data : [
    {
      itemNo: 1,
      tradeId: "111111",
      customerName: "John Doe", 
      customerPoint: 100,
      merchandiseName: "Product A", 
      merchandiseImageUrl: "https://picsum.photos/200/300", 
      totalPrice: 10,
      totalPointUsed: 10,
      remainingPointAfterTrade: 2,
      shipmentStatus: "pending",
      tradedAt: "12/04/2023",
      tradeStatus: "pending"
    },
    {
      itemNo: 2,
      tradeId: "22222",
      customerName: "John Doe", 
      customerPoint: 100,
      merchandiseName: "Product A", 
      merchandiseImageUrl: "https://picsum.photos/200/300", 
      totalPrice: 10,
      totalPointUsed: 10,
      remainingPointAfterTrade: 2,
      shipmentStatus: "shipping_cancel",
      tradedAt: "01/05/2023",
      tradeStatus: "approve_cancel"
    },
    {
      itemNo: 3,
      tradeId: "33333",
      customerName: "John Doe", 
      customerPoint: 100,
      merchandiseName: "Product A", 
      merchandiseImageUrl: "https://picsum.photos/200/300", 
      totalPrice: 10,
      totalPointUsed: 10,
      remainingPointAfterTrade: 2,
      shipmentStatus: "successfully",
      tradedAt: "12/02/2023",
      tradeStatus: "approved"
    }
  ],
  currentPage: 1, 
  perPage: 10, 
  totalPage: 5, 
  totalRow: 5

};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter");

  // เพิ่ม api เรียกข้อมูลในส่วนนี้ comment filter logic ออกใช้การ filter จากฝั่ง api แทน
  //comment
  let TradesInfo = { ...mockupTrades };

  if (filter) {
    TradesInfo.data = mockupTrades.data.filter((trade) => {
      const lowerCaseSearchTerm = filter.toLowerCase();
      return (
        trade.tradeId.toLowerCase().includes(lowerCaseSearchTerm) ||
        trade.customerName.toLowerCase().includes(lowerCaseSearchTerm) ||
        trade.merchandiseName.toLowerCase().includes(lowerCaseSearchTerm)
      );
    });
  }
  //comment

  // Wrap TradesInfo.data in an object with a key 'data' and use json function
  return json({ TradesInfo });
};



export default function Redeem (): JSX.Element {

  const { TradesInfo } = useLoaderData() as { TradesInfo: any };
  const [tradeData, setTradeData] = useState<TradeDetail[]>([]);
  const [tradeMetadata, setTradeMetadata] = useState<TradeMetadata>({ currentPage: 0, perPage: 0, totalPage: 0, totalRow: 0 });
  const [filterQuery, setFilterQuery] = useState<string>("");
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();


  useMemo(() => {
    if (TradesInfo && TradesInfo.data) {
      setTradeMetadata({
        currentPage: TradesInfo.currentPage,
        totalPage: TradesInfo.totalPage,
        totalRow: TradesInfo.totalRow,
        perPage: TradesInfo.perPage
      });

      const tradeDataToSet: TradeDetail[] = TradesInfo.data || [];
      setTradeData(tradeDataToSet);
    } else {
      setTradeMetadata({ currentPage: 0, totalPage: 0, totalRow: 0, perPage: 0 });
      setTradeData([]);
    }
  }, [TradesInfo]);

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
