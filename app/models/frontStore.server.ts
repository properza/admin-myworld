import config from "~/config";
import { constructURL } from "~/utils";

export interface FrontStoreMetadata {
  currentPage: number;
  perPage: number;
  totalPage: number;
  totalRow: number;
}

interface GetFrontStoreParams {
  page: string | null | undefined;
  perPage: number | null | undefined;
  search: string | null | undefined;
  startAt: string | null | undefined
  endAt: string | null | undefined
}

export interface FrontStoreData {
  order_id: string;
  orderNumber: string;
  phone: string;
  email: string | null;
  totalPrice: number;
  point: number;
  paymentStatus: string;
  slipImageUrl: string;
  manual_by: string;
  updated_at?: string;
  customer: {
    picture: string
    name: string;
  }
}

export interface FrontStoreDataWithItemNo extends FrontStoreData {
  itemNo: number;
}

export interface FrontStoreResponse extends FrontStoreMetadata {
  data: FrontStoreData[];
}

export async function getFrontStore(
  accessToken: string,
  params?: Partial<GetFrontStoreParams>,
): Promise<FrontStoreResponse> {
  const endpointURL = constructURL(config.api.baseUrl, `/orders/shop`);

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

  return frontStore as FrontStoreResponse;
}
