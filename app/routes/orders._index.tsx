import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { useLoaderData, useLocation, useSearchParams } from "@remix-run/react";
import { format } from "date-fns";
import { useState, useMemo, useEffect } from "react";

import FrontStore from "~/components/FrontStore";
import Layout from "~/components/Layout";
import OrderTable from "~/components/OrderTable";
import TabsComponent from "~/components/Tabs";
import TradeListTable from "~/components/TradeListTable";
import {
  FrontStoreDataWithItemNo,
  FrontStoreMetadata,
  getFrontStore,
} from "~/models/frontStore.server";
import {
  OrderDataWithItemNo,
  OrderMetadata,
  getOrders,
} from "~/models/order.server";
import {
  getTradeList,
  TradeListDataWithItemNo,
  TradeListMetadata,
} from "~/models/tradeList.server";
import { getUserData, requireUserId } from "~/services/session.server";
import { convertUTC } from "~/utils";

interface DateType {
  startDate: Date | string;
  endDate: Date | string;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);

  var { accessToken } = await getUserData(request);
  const { searchParams } = new URL(request.url);

  const page = searchParams.get("page");
  const filter = searchParams.get("filter");
  const startAt = searchParams.get("startAt");
  const endAt = searchParams.get("endAt");
  const orders = await getOrders(accessToken, {
    page,
    search: filter,
    startAt,
    endAt,
  });
  
  const frontStore = await getFrontStore(accessToken, {
    page,
    search: filter,
    startAt,
    endAt,
  });

  const tradeList = await getTradeList(accessToken, {
    page,
    search: filter,
    startAt,
    endAt,
  });

  return json({ orders, frontStore, tradeList, accessToken });
};

export const meta: MetaFunction = () => [{ title: "My Beer | Order" }];

function OrderIndexPage(): JSX.Element {
  const location = useLocation();

  const { orders, frontStore, tradeList, accessToken } =
    useLoaderData<typeof loader>();
  const [orderData, setOrderData] = useState<OrderDataWithItemNo[]>([]);
  const [tradeListData, setTradeListData] = useState<TradeListDataWithItemNo[]>(
    [],
  );
  const [frontStoreData, setFrontStoreDate] = useState<
    FrontStoreDataWithItemNo[]
  >([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [orderMetadata, setOrderMetadata] = useState<OrderMetadata>({
    currentPage: 1,
    perPage: 0,
    totalPage: 1,
    totalRow: 0,
  });
  const [frontStoreMetadata, setFrontStoreMetadata] =
    useState<FrontStoreMetadata>({
      currentPage: 1,
      perPage: 0,
      totalPage: 1,
      totalRow: 0,
    });

  const [TradeListMetadata, setTradeListMetadata] = useState<TradeListMetadata>(
    {
      currentPage: 1,
      perPage: 0,
      totalPage: 1,
      totalRow: 0,
    },
  );
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  const defaultDate = {
    startDate: format(sevenDaysAgo, "yyyy-MM-dd"),
    endDate: format(today, "yyyy-MM-dd"),
  };
  const [dateValue, setDateValue] = useState<DateType>(defaultDate);

  useEffect(() => {
    setSearchParams(
      (prev) => {
        const updatedSearchParams = new URLSearchParams(prev);
        if (dateValue?.startDate) {
          // start date
          updatedSearchParams.set(
            "startAt",
            convertUTC({ dateValue: dateValue.startDate, isStart: true }),
          );
        } else {
          updatedSearchParams.delete("startAt");
        }
        if (dateValue?.endDate) {
          // end date
          updatedSearchParams.set(
            "endAt",
            convertUTC({ dateValue: dateValue.endDate }),
          );
        } else {
          updatedSearchParams.delete("endAt");
        }

        return updatedSearchParams;
      },
      { preventScrollReset: true },
    );
  }, [dateValue.endDate, dateValue.startDate, setSearchParams]);

  useEffect(() => {
    setSearchParams(
      (prev) => {
        searchQuery ? prev.set("filter", searchQuery) : prev.delete("filter");
        return prev;
      },
      { preventScrollReset: true },
    );
  }, [searchQuery, setSearchParams]);

  useMemo(() => {
    if (frontStore && frontStore.data) {
      setFrontStoreMetadata({
        currentPage: frontStore.currentPage,
        totalPage: frontStore.totalPage,
        totalRow: frontStore.totalRow,
        perPage: frontStore.perPage,
      });

      const data: FrontStoreDataWithItemNo[] = frontStore.data.map(
        (order, index) => ({
          ...order,
          itemNo: (orders.currentPage - 1) * orders.perPage + index + 1,
        }),
      );

      setFrontStoreDate(data);
    } else {
      setFrontStoreMetadata({
        currentPage: 1,
        totalPage: 1,
        totalRow: 0,
        perPage: 10,
      });
      setFrontStoreDate([]);
    }
  }, [frontStore, orders.currentPage, orders.perPage]);

  useMemo(() => {
    if (tradeList && tradeList.data) {
      setTradeListMetadata({
        currentPage: tradeList.currentPage,
        totalPage: tradeList.totalPage,
        totalRow: tradeList.totalRow,
        perPage: tradeList.perPage,
      });

      const data: TradeListDataWithItemNo[] = tradeList.data.map(
        (order, index) => ({
          ...order,
          itemNo: (orders.currentPage - 1) * orders.perPage + index + 1,
        }),
      );

      setTradeListData(data);
    } else {
      setTradeListMetadata({
        currentPage: 1,
        totalPage: 1,
        totalRow: 0,
        perPage: 10,
      });
      setTradeListData([]);
    }
  }, [tradeList, orders.currentPage, orders.perPage]);

  useMemo(() => {
    if (orders && orders.data) {
      setOrderMetadata({
        currentPage: orders.currentPage,
        totalPage: orders.totalPage,
        totalRow: orders.totalRow,
        perPage: orders.perPage,
      });

      const data: OrderDataWithItemNo[] = orders.data.map((order, index) => ({
        ...order,
        itemNo: (orders.currentPage - 1) * orders.perPage + index + 1,
      }));

      setOrderData(data);
    } else {
      setOrderMetadata({
        currentPage: 1,
        totalPage: 1,
        totalRow: 0,
        perPage: 10,
      });
      setOrderData([]);
    }
  }, [orders]);

  const handleChangeDate = (newValue: DateType) => {
    setDateValue(newValue);
  };
  // console.log(frontStoreData);
  return (
    <Layout
      title="Order"
      isSubRoute={false}
      returnRoute=""
      pathname={location.pathname}
    >
      <TabsComponent
        isShowSearch
        isShowDate
        search={searchQuery}
        setSearch={setSearchQuery}
        dateValue={dateValue}
        onChangeDate={handleChangeDate}
        onChange={() => {
          setDateValue(defaultDate);
          setSearchQuery("");
        }}
        tabs={[
          {
            name: "Order",
            label: "รายการสั่งซื้อ",
            content: (
              <OrderTable data={{ ...orderMetadata, data: orderData }} />
            ),
          },
          {
            name: "FrontStore",
            label: "จำหน่ายหน้าร้าน",
            content: (
              <FrontStore
                data={{ ...frontStoreMetadata, data: frontStoreData }}
              />
            ),
          },
          {
            name: "Trade",
            label: "รายการซื้อMy Beer",
            content: (
              <TradeListTable
                data={{ ...TradeListMetadata, data: tradeListData }}
                accessToken={accessToken}
                
              />
            ),
          },
        ]}
      />
    </Layout>
  );
}

export default OrderIndexPage;
