import config from "~/config";
import { constructURL } from "~/utils";

export interface SetboxesMetadata {
    currentPage: number;
    perPage: number;
    totalPage: number;
    totalRow: number;
}

interface GetSetboxesParams {
    page: string | null | undefined;
    perPage: number | null | undefined;
    startDate: string | null | undefined;
    endDate: string | null | undefined;
    search: string | null | undefined;
}

export interface SetboxesData {
    id: string;
    redeem_code: string;
    approve_status: string;
    expired_date: string;
    is_used: string;
    point: string;
    created_at: string;
    customer_name: string;
    customer_picture: string;
    coupon_name: string;
    restaurant_name: string;
    restaurant_branch_name: string;
}

export interface SetboxesDataWithItemNo extends SetboxesData {
    itemNo: number;
}

export interface SetboxesResponse extends SetboxesMetadata {
    data: SetboxesData[];
}

export async function SetboxesHistoryList(
    accessToken: string,
    params?: Partial<GetSetboxesParams>,
): Promise<SetboxesResponse> {
    const endpointURL = constructURL(config.api.baseUrl, `/mymap/allRedeemCouponHistoryAdmin`);

    // เพิ่ม query params
    if (params?.page) {
        endpointURL.searchParams.set("page", String(params.page));
    }

    if (params?.perPage) {
        endpointURL.searchParams.set("perPage", String(params.perPage));
    }

    if (params?.search) {
        endpointURL.searchParams.set("search", params.search);
    }

    if (params?.startDate) {
        endpointURL.searchParams.set("start_date", String(params.startDate));
    }

    if (params?.endDate) {
        endpointURL.searchParams.set("end_date", String(params.endDate));
    }

    const response = await fetch(endpointURL.toString(), {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const Setboxes = await response.json();

    return Setboxes as SetboxesResponse;
}

export async function getCustomerReedeem(
    accessToken: string,
    userId: string,
  ): Promise<SetboxesData> {
    const endpointURL = constructURL(
      config.api.baseUrl,
      `/mymap/allRedeemCouponHistoryAdmin/${userId}`,
    );
  
    const response = await fetch(endpointURL.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
  
    const Setboxes = await response.json();
  
    return Setboxes as SetboxesData;
  }
  