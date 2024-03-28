import config from "~/config";
import { constructURL } from "~/utils";

export interface StockMetadata {
  currentPage: number;
  perPage: number;
  totalPage: number;
  totalRow: number;
}

interface GetStockParams {
  page: string | null | undefined;
  perPage: number | null | undefined;
  search: string | null | undefined;
  startAt: string | null | undefined;
  endAt: string | null | undefined;
}

export interface StockData {
  id: number;
  name: string;
  variant: string;
  price: number;
  stock: number;
  sold: number;
  remain: number;
  isDisplay: boolean;
}

export interface StockDataWithItemNo extends StockData {
  id: number;
}

export interface StockResponse extends StockMetadata {
  data: StockData[];
}

export async function getStock(
  accessToken: string,
  params?: Partial<GetStockParams>,
): Promise<StockResponse> {
  const endpointURL = constructURL(config.api.baseUrl, `/products`);

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

  const Stock = await response.json();

  return Stock as StockResponse;
}

export async function getStockHistory(
  accessToken: string,
  params?: Partial<GetStockParams>,
): Promise<StockResponse> {
  const endpointURL = constructURL(config.api.baseUrl, `/products/history`);

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

  const Stock = await response.json();

  return Stock as StockResponse;
}
