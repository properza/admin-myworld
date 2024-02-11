import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { useLoaderData, useLocation, useSearchParams } from "@remix-run/react";
import { useState, useMemo, useEffect } from "react";

import Exchange from "~/components/Exchange";
import FrontStore from "~/components/FrontStore";
import Layout from "~/components/Layout";
import OrderTable from "~/components/OrderTable";
import TabsComponent from "~/components/Tabs";
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
import { getUserData, requireUserId } from "~/services/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);

  const { accessToken } = await getUserData(request);
  const { searchParams } = new URL(request.url);

  const page = searchParams.get("page");
  const filter = searchParams.get("filter");
  const orders = await getOrders(accessToken, { page });
  const frontStore = await getFrontStore(accessToken, { page, search: filter });

  return json({ orders, frontStore });
};

export const meta: MetaFunction = () => [{ title: "My Beer | Order" }];

function OrderIndexPage(): JSX.Element {
  const location = useLocation();

  const { orders, frontStore } = useLoaderData<typeof loader>();
  const [orderData, setOrderData] = useState<OrderDataWithItemNo[]>([]);
  const [frontStoreData, setFrontStoreDate] = useState<
    FrontStoreDataWithItemNo[]
  >([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [, setSearchParams] = useSearchParams();
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

  return (
    <Layout
      title="Order"
      isSubRoute={false}
      returnRoute=""
      pathname={location.pathname}
    >
      <TabsComponent
        isSearch
        search={searchQuery}
        setSearch={setSearchQuery}
        tabs={[
          {
            label: "รายการสั่งซื้อ",
            content: (
              <OrderTable data={{ ...orderMetadata, data: orderData }} />
            ),
          },
          { label: "การแลกซื้อสินค้า", content: <Exchange /> },
          {
            label: "จำหน่ายหน้าร้าน",
            content: (
              <FrontStore
                data={{ ...frontStoreMetadata, data: frontStoreData }}
              />
            ),
          },
        ]}
      />
    </Layout>
  );
}

export default OrderIndexPage;
