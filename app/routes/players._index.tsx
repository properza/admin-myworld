import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { useLoaderData, useLocation, useSearchParams } from "@remix-run/react";
import { format } from "date-fns";
import { useState, useMemo, useEffect } from "react";

import Layout from "~/components/Layout";
import PlayerTable from "~/components/PlayerTable";

import {
  playersList,
  PlayersDataWithItemNo,
  PlayersMetadata,
} from "~/models/players.server";

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

  const players = await playersList(accessToken, {
    page: page,
    perPage: 50,
    search: filter,
    startAt,
    endAt,
  });

  return json({ players, accessToken });
};

export const meta: MetaFunction = () => [{ title: "My Beer | Player" }];

export default function  PlayerIndexPage(): JSX.Element {
  const location = useLocation();
  const [filterQuery, setFilterQuery] = useState<string>("");
  const { players, accessToken } = useLoaderData<typeof loader>();
  const [playersData, setPlayersDate] = useState<PlayersDataWithItemNo[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchParams,setSearchParams] = useSearchParams();
  const [page, setPage] = useState<number>(1);

  const [PlayersMetadata, setPlayersMetadata] = useState<PlayersMetadata>({
    currentPage: 1,
    perPage: 0,
    totalPage: 1,
    totalRow: 0,
  });

  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  const defaultDate = {
    startDate: format(sevenDaysAgo, "yyyy-MM-dd"),
    endDate: format(today, "yyyy-MM-dd"),
  };
  const [dateValue, setDateValue] = useState<DateType>(defaultDate);
  
  const handleDateChange = (newDateValue: DateType) => {
    setDateValue(newDateValue);
  };

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
        prev.set("page", page.toString());
        return prev;
      },
      { preventScrollReset: true },
    );
  }, [ page , searchQuery ]);



  useMemo(() => {
    if (players && players.data) {
      setPlayersMetadata({
        currentPage: players.currentPage,
        totalPage: players.totalPage,
        totalRow: players.totalRow,
        perPage: players.perPage,
      });

      const data: PlayersDataWithItemNo[] = players.data.map(
        (player, index) => ({
          ...player,
          itemNo: (players.currentPage - 1) * players.perPage + index + 1,
        }),
      );
      setPlayersDate(data);
      setPage(players.currentPage);
    } else {
      setPlayersMetadata({
        currentPage: 1,
        totalPage: 1,
        totalRow: 0,
        perPage: 10,
      });
      setPlayersDate([]);
      setPage(1);
    }
  }, [players]);

  return (
    <Layout
      title="ผู้เล่น"
      isSubRoute={false}
      returnRoute=""
      pathname={location.pathname}
    >
      <PlayerTable
        data={{ ...PlayersMetadata, data: playersData }}
        filter={filterQuery}
        setFilter={setFilterQuery}
        setPage={setPage}
        onDateChange={handleDateChange}
      />
    </Layout>
  );
}

