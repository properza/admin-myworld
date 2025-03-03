import config from "~/config";
import { constructURL } from "~/utils";

export interface CustomerEventMetadata {
    currentPage: number;
    perPage: number;
    totalPage: number;
    totalRow: number;
  }
  
interface GetCustomersParams {
    page: string | null | undefined;
    perPage: number | null | undefined;
    startDate: string | null | undefined;
    endDate: string | null | undefined;
    search: string | null | undefined;
}

export interface CustomersData {
    id: string;
    status: string;
    image_url: string;
    created_at: string;
    customer_name: string;
    customer_picture: string;
    restaurant_name: string;
    branch_name: string;
}

export interface CustomersDataWithItemNo extends CustomersData {
    itemNo: number;
}

export interface CustomersResponse extends CustomerEventMetadata {
    data: CustomersData[];
}

export async function CheckInHistoryList(
    accessToken: string,
    params?: Partial<GetCustomersParams>,
): Promise<CustomersResponse> {
    const endpointURL = constructURL(config.api.baseUrl, `/mymap/allCheckInHistoryAdmin`);

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

    const customersE = await response.json();

    return customersE as CustomersResponse;
}

// export async function CustomersDetail(
//     accessToken: string,
//     cilentId: string,
// ): Promise<any> {
//     const endpointURL = constructURL(
//         config.api.baseUrl,
//         `/mymap/allCheckInHistoryAdmin/${cilentId}`,
//     );

//     const response = await fetch(endpointURL.toString(), {
//         method: "GET",
//         headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//         },
//     });

//     const responseData = await response.json();

//     return responseData;
// }
