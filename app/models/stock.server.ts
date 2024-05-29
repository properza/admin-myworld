import config from "~/config";
import { constructURL } from "~/utils";

export interface StockMetadata {
  currentPage: number;
  perPage: number;
  totalPage: number;
  totalRow: number;
}

export interface HistoryMetadata {
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
  imageUrls: string;
}

export interface StockDataWithItemNo extends StockData {
  itemNo: number;
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

export interface HistoryStockData {
  id: number; // Change this line
  name: string;
  code: string;
  value: number;
  admin_name: string;
  type: string;
  sku: Variant["sku"];
  onHandNumber: Variant["onHandNumber"];
  availableNumber: Variant["availableNumber"];
  stock: number;
  isDisplay: boolean;
  price: number;
  imageUrls: string;
  variants: Variant[];
}

export interface HistoryStockDataWithItemNo extends HistoryStockData {
  itemNo: number;
}

interface Variant {
  id: number;
  sku: string;
  price: number;
  weight: number;
  barcode: string;
  options: any[];
  inventoryId: number;
  onHandNumber: number;
  reservedNumber: number;
  availableNumber: number;
  discountedPrice: number | null;
  readyToShipNumber: number;
}

export interface HistoryStockDataWithItemNo extends HistoryStockData {
  id: number;
}

export interface HistoryStockResponse extends HistoryMetadata {
  data: HistoryStockData[];
}

export async function getStockHistory(
  accessToken: string,
  params?: Partial<GetStockParams>,
): Promise<HistoryStockResponse> {
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

  const HistoryStock = await response.json();

  return HistoryStock as HistoryStockResponse;
}
