import config from "~/config";
import { constructURL } from "~/utils";

import { Order } from "./order.server";
import { Trade } from "./trade.server";

export interface Customer {
  customer_id: string;
  name: string;
  phone: string;
  email: string;
  picture: string;
  point: number;
  game_point: number;
  order: Order[];
  trade: Trade[];
  created_at: string;
  updated_at: string;
}

export interface CustomerWithItemNo extends Customer {
  itemNo: number;
}

export interface CustomerMetadata {
  currentPage: number;
  perPage: number;
  totalPage: number;
  totalRow: number;
}

export interface CustomerResponse extends CustomerMetadata {
  data: Customer[];
}

interface GetCustomerParams {
  page: string | null | undefined;
  search: string | null | undefined;
  perPage: number | null | undefined;
}

export async function getCustomers(
  accessToken: string,
  params?: Partial<GetCustomerParams>,
): Promise<CustomerResponse> {
  const endpointURL = constructURL(
    config.api.baseUrl,
    "/customers/administrator",
  );

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
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const customers = await response.json();

  return customers as CustomerResponse;
}

export async function getCustomer(
  accessToken: string,
  userId: string,
): Promise<Customer> {
  const endpointURL = constructURL(
    config.api.baseUrl,
    `/customers/administrator/${userId}`,
  );

  const response = await fetch(endpointURL.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const customer = await response.json();

  return customer as Customer;
}
