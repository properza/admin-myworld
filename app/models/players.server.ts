import config from "~/config";
import { constructURL } from "~/utils";

export interface PlayersMetadata {
  currentPage: number;
  perPage: number;
  totalPage: number;
  totalRow: number;
}

interface GetPlayersParams {
  page: string | null | undefined;
  perPage: number | null | undefined;
  search: string | null | undefined;
  startAt: string | null | undefined;
  endAt: string | null | undefined;
}

export interface PlayersData {
  id: number;
  point: number;
  game_point: number;
  customer_id: string;
  name: string;
  picture: string;
  email: string;
  phone: string;
  game_status: string;
  banned_due: boolean;
  game_level: number;
  created_at: string;
  updated_at: string;
}

export interface PlayersDataWithItemNo extends PlayersData {
  itemNo: number;
}

export interface PlayersResponse extends PlayersMetadata {
  data: PlayersData[];
}

export async function playersList(
  accessToken: string,
  params?: Partial<GetPlayersParams>,
): Promise<PlayersResponse> {
  const endpointURL = constructURL(config.api.baseUrl, `games/allplayer`);

  if (params?.page) {
    endpointURL.searchParams.set("page", String(params.page));
  }

  if (params?.perPage) {
    endpointURL.searchParams.set("perPage", String(params.perPage));
  }

  if (params?.search) {
    endpointURL.searchParams.set("search", params.search);
  }

  if (params?.startAt) {
    endpointURL.searchParams.set("startAt", String(params.startAt));
  }

  if (params?.endAt) {
    endpointURL.searchParams.set("endAt", String(params.endAt));
  }

  const response = await fetch(endpointURL.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const frontStore = await response.json();

  return frontStore as PlayersResponse;

}

export async function playersDetail(
  accessToken: string,
  cilentId: string,
): Promise<any> {
  const endpointURL = constructURL(
    config.api.baseUrl,
    `/customers/administrator/${cilentId}/gameInfo`,
  );

  const response = await fetch(endpointURL.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  console.log(1111111);
  const frontStore = await response.json();

  return frontStore;
}
