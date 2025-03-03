
import axios from "axios";
import { format } from "date-fns";
import { convertUTC } from "~/utils";
import Layout from "~/components/Layout";
import { useState, useMemo, useEffect } from "react";
import { getUserData, requireUserId } from "~/services/session.server";
import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { useLoaderData, useLocation, useSearchParams } from "@remix-run/react";
import SetboxTable from "~/components/SetboxTable";

import {
  SetboxesHistoryList,
  SetboxesDataWithItemNo,
  SetboxesMetadata
} from "~/models/setbox.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);

  var { accessToken } = await getUserData(request);
  const { searchParams } = new URL(request.url);

  const page = searchParams.get("page");
  const filter = searchParams.get("filter");
  const startDate = searchParams.get("startAt");
  const endDate = searchParams.get("endAt");

  const Setboxes = await SetboxesHistoryList(accessToken, {
    page,
    search: filter,
    startDate,
    endDate,
  });

  return json({ Setboxes, accessToken });
};

export const meta: MetaFunction = () => [{ title: "My Beer | Set Box" }];

export default function SetboxesIndexPage() {
  const [filterQuery, setFilterQuery] = useState<string>("");
  const { Setboxes, accessToken } = useLoaderData<typeof loader>();
  const [SetboxesData, setcustomersEDate] = useState<SetboxesDataWithItemNo[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [page, setPage] = useState<number>(1);

  const [SetboxMeta, setSetboxMeta] = useState<SetboxesMetadata>({
    currentPage: 1,
    perPage: 0,
    totalPage: 1,
    totalRow: 0,
  });

  useMemo(() => {
    if (Setboxes && Setboxes.data) {
      setSetboxMeta({
        currentPage: Setboxes.currentPage,
        totalPage: Setboxes.totalPage,
        totalRow: Setboxes.totalRow,
        perPage: Setboxes.perPage,
      });

      const data: SetboxesDataWithItemNo[] = Setboxes.data.map(
        (customer, index) => ({
          ...customer,
          itemNo: (Setboxes.currentPage - 1) * Setboxes.perPage + index + 1,
        }));

      setcustomersEDate(data);
      setPage(Setboxes.currentPage);
    } else {
      setSetboxMeta({
        currentPage: 1,
        totalPage: 1,
        totalRow: 0,
        perPage: 10,
      });
      setcustomersEDate([]);
      setPage(1);
    }
  }, [Setboxes]);

  useEffect(() => {
    setSearchParams(
        (prev) => {
            filterQuery ? prev.set("filter", filterQuery) : prev.delete("filter");
            prev.set("page", page.toString()); // Update search params with current page
            return prev;
        },
        { preventScrollReset: true },
    );
}, [page, filterQuery]);

  return (
    <Layout
      title="การแลก Box Set"
      pathname={location.pathname}
      isSubRoute={false}
      returnRoute=""
    >
      <SetboxTable
          data={{ ...SetboxMeta, data: SetboxesData }}
          accessToken={accessToken}
          filter={filterQuery}
          setFilter={setFilterQuery}
      />
    </Layout>
  )
}
