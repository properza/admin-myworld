import { Button } from "@material-ui/core";
import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import {
  Link,
  useLoaderData,
  useLocation,
  useSearchParams,
} from "@remix-run/react";
import { format } from "date-fns";
import { useState, useMemo, useEffect } from "react";

import Layout from "~/components/Layout";
import TradeListTable from "~/components/TradeListTable";
import {
  // OrderDataWithItemNo,
  // OrderMetadata,
  getStock,
} from "~/models/stock.server";
import { getUserData, requireUserId } from "~/services/session.server";
import StockTable from "~/components/StockTable";

// import { convertUTC } from "~/utils";

// interface DateType {
//   startDate: Date | string;
//   endDate: Date | string;
// }

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);

  const { accessToken } = await getUserData(request);
  const { searchParams } = new URL(request.url);

  const page = searchParams.get("page");
  const filter = searchParams.get("filter");
  const startAt = searchParams.get("startAt");
  const endAt = searchParams.get("endAt");
  const stock = await getStock(accessToken, {
    page,
    search: filter,
    startAt,
    endAt,
  });

  return json({ stock, accessToken });
};



export const meta: MetaFunction = () => [{ title: "My Beer | Stock" }];

function StoreIndexPage(): JSX.Element {
  const location = useLocation();
  const [filter, setFilter] = useState("");
  const { stock, accessToken } = useLoaderData<typeof loader>();

  return (
    <Layout
      title="สต็อกหน้าร้าน"
      isSubRoute={false}
      returnRoute=""
      pathname={location.pathname}
    >
      <div className="my-4 flex">
        <Link
          to={"/stock/history"}
          className="border-[1px] border-indigo-500/100 text-indigo-500 font-bold py-2 px-4 rounded mr-3"
        >
          History
        </Link>
      </div>

      <StockTable
        data={{
          currentPage: 1,
          perPage: 10,
          totalPage: 1,
          totalRow: 0,
          data: stock.data,
        }}
        filter={filter}
        setFilter={setFilter}
        accessToken={accessToken}
      />
    </Layout>
  );
}

export default StoreIndexPage;
