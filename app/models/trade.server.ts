import config from "~/config"
import { constructURL } from "~/utils"


import { Merchandise } from "./merchandise.server"

// export interface Trade {
//   trade_id: string
//   trade_number: string
//   shipment_status: string
//   address: string
//   sub_district: string
//   district: string
//   province: string
//   postcode: string
//   phone: string
//   point: number
//   created_at: string
//   customer_id: string
//   merchandise_id: string
//   merchandise: Merchandise
// }



export interface Trades {
  trade_id: string
  approve_status: string
  shipment_status: string
  address?: string
  sub_district?: string
  district?: string
  province?: string
  postcode?: string
  phone?: string
  point?: number
  created_at: string
  customer_id: string
  merchandise_id: string
  merchandise: Merchandise
  customer: Customer
}

export interface TradesWithItemNo extends Trades {
  itemNo: number
}

export interface Customer {
  customer_id: string
  name: string
  picture: string
  email: string
  phone: string
}

export interface TradeResponse extends TradeMetadata {
  data: Trades[]
}


export interface TradeMetadata {
  currentPage: number
  perPage: number
  totalPage: number
  totalRow: number
}

interface GetTradeParams {
  page: string | null | undefined
  search: string | null | undefined
  perPage: number | null | undefined
}



export interface TradesDetail {
  trade_id: string
  trade_number: string
  approve_status: string
  shipment_status: string
  address: string
  sub_district: string
  district: string
  province: string
  postcode: string
  phone: string
  point: number
  is_delete: boolean
  created_at: string
  updated_at: string
  customer_id: string
  merchandise_id: string
  merchandise: MerchandiseDeatil
  customer: Customer
}


export interface MerchandiseDeatil {
  merchandise_id: string
  picture: string
  name: string
  title1: string
  title2: string
  description: string
  start_date: string
  end_date: string
  point: number
  price: number
  redeem_per_customer: any
  is_publish: boolean
  is_delete: boolean
  created_at: string
  updated_at: string
}

export interface TradesDetailWithItemNo extends TradesDetail {
  itemNo: number
}


export interface TradeDetailResponse extends TradeMetadata {
  data: TradesDetail
}



export async function getTrades (accessToken: string, params?: Partial<GetTradeParams>): Promise<TradeResponse> {
  const endpointURL = constructURL(config.api.baseUrl, "/trades/admin");

  if (params?.page) {
    endpointURL.searchParams.set("page", String(params.page));
  }

  if (params?.search) {
    endpointURL.searchParams.set("search", params.search);
  }

  if (params?.perPage) {
    endpointURL.searchParams.set("perPage", String(params.perPage));
  }

  const response = await fetch(endpointURL.toString(), {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });

  const trades = await response.json();

  return trades as TradeResponse;
}

export async function getTradesDetail (accessToken: string, userId: string): Promise<TradeDetailResponse> {
  const endpointURL = constructURL(config.api.baseUrl, `/trades/${userId}`);

  const response = await fetch(endpointURL.toString(), {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });

  const tradesDeatil = await response.json();

  return tradesDeatil as TradeDetailResponse;
}
