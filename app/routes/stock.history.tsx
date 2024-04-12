import { Button } from "@material-ui/core";
import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { useLoaderData, useLocation, useSearchParams } from "@remix-run/react";
import { format } from "date-fns";
import { useState, useMemo, useEffect } from "react";

import Layout from "~/components/Layout";
import StockPopup from "~/components/StockModal";
import {
  getStockHistory,
  HistoryMetadata,
  HistoryStockDataWithItemNo,
} from "~/models/stock.server";
import { getUserData, requireUserId } from "~/services/session.server";
import HistoryTable from "~/components/HistoryTable";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    await requireUserId(request);

    const { accessToken } = await getUserData(request);
    const { searchParams } = new URL(request.url);

    const page = searchParams.get("page");
    const filter = searchParams.get("filter");
    const history = await getStockHistory(accessToken, {
      page,
      search: filter,
    });

    return json({ history, accessToken });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const meta: MetaFunction = () => [{ title: "My Beer | History" }];

function StoreHistory(): JSX.Element {
  const location = useLocation();
  const { history, accessToken } = useLoaderData<typeof loader>();
  const [historyData, setHistoryData] = useState<HistoryStockDataWithItemNo[]>(
    [],
  );
  const [HistoryMetadata, setHistoryMetadata] = useState<HistoryMetadata>({
    currentPage: 1,
    perPage: 0,
    totalPage: 1,
    totalRow: 0,
  });

  // console.log(history);

  useMemo(() => {
    if (history && history.data) {
      setHistoryMetadata({
        currentPage: history.currentPage,
        totalPage: history.totalPage,
        totalRow: history.totalRow,
        perPage: history.perPage,
      });
      const data: HistoryStockDataWithItemNo[] = history.data.map(
        (order, index) => ({
          ...order,
          itemNo: (history.currentPage - 1) * history.perPage + index + 1,
        }),
      );
      setHistoryData(data);
    }
  }, [history]);

  return (
    <Layout
      title="History"
      isSubRoute={true}
      returnRoute={"/stock"}
      pathname={location.pathname}
    >
      <HistoryTable
        data={{ ...HistoryMetadata, data: historyData }}
        accessToken={accessToken}
      />
    </Layout>
  );
}

export default StoreHistory;
