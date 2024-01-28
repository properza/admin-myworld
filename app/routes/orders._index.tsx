import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { useLoaderData, useLocation } from "@remix-run/react";
import { useState, useMemo } from "react";

import Layout from "~/components/Layout";
import OrderTable from "~/components/OrderTable";
import { OrderDataWithItemNo, OrderMetadata, getOrders } from "~/models/order.server";
import { getUserData, requireUserId } from "~/services/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);

  const { accessToken } = await getUserData(request);
  const { searchParams } = new URL(request.url);

  const page = searchParams.get("page");
  const orders = await getOrders(accessToken, { page });

  return json({ orders });
}

export const meta: MetaFunction = () => [{ title: "My Beer | Order" }];

function OrderIndexPage (): JSX.Element {
  const location = useLocation();

  const { orders } = useLoaderData<typeof loader>();
  const [orderData, setOrderData] = useState<OrderDataWithItemNo[]>([]);
  const [orderMetadata, setOrderMetadata] = useState<OrderMetadata>({ currentPage: 1, perPage: 0, totalPage: 1, totalRow: 0 });

  useMemo(() => {
    if (orders && orders.data) {
      setOrderMetadata({
        currentPage: orders.currentPage,
        totalPage: orders.totalPage,
        totalRow: orders.totalRow,
        perPage: orders.perPage
      });

      const data: OrderDataWithItemNo[] = orders.data.map((order, index) => ({
        ...order,
        itemNo: (orders.currentPage - 1) * orders.perPage + index + 1
      }));

      setOrderData(data);
    } else {
      setOrderMetadata({ currentPage: 1, totalPage: 1, totalRow: 0, perPage: 10 });
      setOrderData([]);
    }
  }, [orders]);

  return (
    <Layout title="Order" isSubRoute={false} returnRoute="" pathname={location.pathname}>
      <OrderTable data={{ ...orderMetadata, data: orderData }} />
    </Layout>
  )
}

export default OrderIndexPage;
