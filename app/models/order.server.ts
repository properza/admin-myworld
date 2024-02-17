import config from "~/config"
import { constructURL } from "~/utils"

export interface Order {
  order_id: string
  orderNumber: string
  phone: string
  email: string
  point: null
  discountAmount: string
  event: string
  isGift: boolean
  orderItems: OrderItem[]
  orderStatus: string
  paymentMethod: string
  paymentStatus: string
  remarkBuyer: string
  remarkRecipient: string
  shipmentDetail: ShipmentDetail
  shipmentPrice: number
  shipmentStatus: string
  shippingAddress: ShippingAddress
  shop?: string | null | undefined
  subtotalPrice: number
  totalPrice: number
  weight: number
  created_at: string
  updated_at: string
}

export interface OrderWithItemNo extends Order {
  itemNo: number
}

export interface OrderItem {
  productId: number
  sku: string
  name: string
  price: number
  weight: number
  variantId: number
  quantity: number
  barcode: string
  imageURL: string
  discountedPrice: number
}

export interface OrderItemWithItemNo extends OrderItem {
  itemNo: number
}

export interface ShipmentDetail {
  name: string
  type: string
  isCod: boolean
  description: string
  trackingUrl: string
  trackingNumber: string
  shipmentCompanyId: number
  shipmentCompanyNameEn: string
  shipmentCompanyNameTh: string
}

export interface ShippingAddress {
  recipientName: string
  phoneNumber: string
  email: string
  address: string
  subDistrict: string
  district: string
  province: string
  postalCode: string
  country: string
}

export interface OrderMetadata {
  currentPage: number
  perPage: number
  totalPage: number
  totalRow: number
}

export interface OrderData {
  orderNumber: string
  phone: string
  email: string
  totalPrice: number
  point: number
  paymentStatus: string
  shipmentStatus: string
  lastUpdatedAt: string
  customer: {
    picture: string
    name: string;
  }
}

export interface OrderDataWithItemNo extends OrderData {
  itemNo: number
}

export interface OrderResponse extends OrderMetadata {
  data: OrderData[]
}

interface GetOrderParams {
  page: string | null | undefined
  perPage: number | null | undefined
  startAt: string | null | undefined
  endAt: string | null | undefined
  search: string | null | undefined
}

export async function getOrders (accessToken: string, params?: Partial<GetOrderParams>): Promise<OrderResponse> {
  const endpointURL = constructURL(config.api.baseUrl, "/orders");

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
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });

  const orders = await response.json();

  return orders as OrderResponse;
}

export interface GetOrderResponse {
  orderNumber: string
  orderStatus: string
  orderItems: OrderItem[]
  paymentMethod: string
  discountAmount: number
  paymentStatus: string
  remarkBuyer: string
  shipmentDetail: ShipmentDetail
  shipmentPrice: number
  shipmentStatus: string
  shippingAddress: ShippingAddress
  subtotalPrice: number
  totalPrice: number
  weight: number
  checkoutAt: string
  lastUpdatedAt: string
  paidAt: string
  isGift: boolean
  remarkRecipient: string
}


export async function getOrder (accessToken: string, orderId: string): Promise<GetOrderResponse> {
  const endpointURL = constructURL(config.api.baseUrl, `/orders/${orderId}`);

  const response = await fetch(endpointURL.toString(), {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });

  const order = await response.json();

  return order as GetOrderResponse;
}
