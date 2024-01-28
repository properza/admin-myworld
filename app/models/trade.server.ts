import { Merchandise } from "./merchandise.server"

export interface Trade {
  trade_id: string
  trade_number: string
  shipment_status: string
  address: string
  sub_district: string
  district: string
  province: string
  postcode: string
  phone: string
  point: number
  created_at: string
  customer_id: string
  merchandise_id: string
  merchandise: Merchandise
}


export interface TradeDetail {
  itemNo: number
  tradeId: string
  customerName: string
  customerPoint: number
  merchandiseName: string
  merchandiseImageUrl: string
  totalPrice: number
  totalPointUsed: number
  remainingPointAfterTrade: number
  shipmentStatus: string
  tradedAt: string
  tradeStatus: string
}

export interface TradeMetadata {
  currentPage: number
  perPage: number
  totalPage: number
  totalRow: number
}
