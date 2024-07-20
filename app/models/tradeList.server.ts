import config from "~/config";
import { constructURL } from "~/utils";

export interface TradeListMetadata {
  currentPage: number;
  perPage: number;
  totalPage: number;
  totalRow: number;
}

interface GetTradeListParams {
  page: string | null | undefined;
  perPage: number | null | undefined;
  search: string | null | undefined;
  startAt: string | null | undefined;
  endAt: string | null | undefined;
}

export interface OrderItem {
  sku: string | null;
  name: string;
  price: number;
  weight: number;
  barcode: string;
  imageURL: string;
  quantity: number;
  productId: string;
  variantId: number;
  discountedPrice: number | null;
}

export interface TradeListData {
  order_id: string;
  orderNumber: string;
  phone: string;
  email: string | null;
  totalPrice: number;
  point: number;
  slipImageUrl: string;
  updated_at: string;
  customer: {
    picture: string;
    name: string;
  };
  orderItems: OrderItem[];
  storefront_status: string;
}

export interface TradeListDataWithItemNo extends TradeListData {
  itemNo: number;
}

export interface TradeListResponse extends TradeListMetadata {
  data: TradeListData[];
}

export async function getTradeList(
  accessToken: string,
  params?: Partial<GetTradeListParams>,
): Promise<TradeListResponse> {
  const endpointURL = constructURL(config.api.baseUrl, `/orders/storefront`);

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

  return frontStore as TradeListResponse;
}

export async function tradeList(
  accessToken: string,
  params?: Partial<GetTradeListParams>,
): Promise<TradeListResponse> {
  const endpointURL = constructURL(config.api.baseUrl, `/orders/storefront`);

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

  return frontStore as TradeListResponse;
}
