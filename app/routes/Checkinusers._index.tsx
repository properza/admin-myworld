import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { useLoaderData, useLocation, useSearchParams } from "@remix-run/react";
import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import Layout from "~/components/Layout";
import { getUserData, requireUserId } from "~/services/session.server";
import { format } from "date-fns";
import { convertUTC } from "~/utils";
import CustomerCheckinTable from "~/components/CustomerCheckinTable";

import {
    CheckInHistoryList
    , CustomersDataWithItemNo
    , CustomerEventMetadata
} from "~/models/customerEvent.server";

interface DateType {
    startDate: Date | string;
    endDate: Date | string;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    await requireUserId(request);
    
    var { accessToken } = await getUserData(request);
    const { searchParams } = new URL(request.url);
    
    const page = searchParams.get("page");
    const filter = searchParams.get("filter");
    const startDate = searchParams.get("startAt");
    const endDate = searchParams.get("endAt");
    
    const customersE = await CheckInHistoryList(accessToken, {
        page,
        search: filter,
        startDate,
        endDate,
    });
    
    return json({ customersE, accessToken });
};

export const meta: MetaFunction = () => [{ title: "My Beer | Check in" }];


export default function CheckinusersIndexPage(): JSX.Element {
    const [filterQuery, setFilterQuery] = useState<string>("");
    const { customersE, accessToken } = useLoaderData<typeof loader>();
    const [customersEData, setcustomersEDate] = useState<CustomersDataWithItemNo[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const [page, setPage] = useState<number>(1);

    const [CustomersMetadata, setCustomersMetadata] = useState<CustomerEventMetadata>({
        currentPage: 1,
        perPage: 0,
        totalPage: 1,
        totalRow: 0,
    });

    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    const defaultDate = {
        startDate: format(sevenDaysAgo, "yyyy-MM-dd"),
        endDate: format(today, "yyyy-MM-dd"),
    };

    const [dateValue, setDateValue] = useState<DateType>(defaultDate);

    useMemo(() => {
        if (customersE && customersE.data) {
            setCustomersMetadata({
                currentPage: customersE.currentPage,
                totalPage: customersE.totalPage,
                totalRow: customersE.totalRow,
                perPage: customersE.perPage,
            });

            const data: CustomersDataWithItemNo[] = customersE.data.map(
                (customer, index) => ({
                    ...customer,
                    itemNo: (customersE.currentPage - 1) * customersE.perPage + index + 1,
                }));

            setcustomersEDate(data);
            setPage(customersE.currentPage);
        } else {
            setCustomersMetadata({
                currentPage: 1,
                totalPage: 1,
                totalRow: 0,
                perPage: 10,
            });
            setcustomersEDate([]);
            setPage(1);
        }
    }, [customersE]); // Only run when customersE changes

    useEffect(() => {
        setSearchParams(
            (prev) => {
                filterQuery ? prev.set("filter", filterQuery) : prev.delete("filter");
                prev.set("page", page.toString()); // Update search params with current page
                return prev;
            },
            { preventScrollReset: true },
        );
    }, [page, filterQuery]);

    console.log(location.pathname)

    return (
        <Layout
            title="ข้อมูลการ Check in"
            pathname={location.pathname}
            isSubRoute={false}
            returnRoute=""
        >
            <CustomerCheckinTable
                data={{ ...CustomersMetadata, data: customersEData }}
                accessToken={accessToken}
                filter={filterQuery}
                setFilter={setFilterQuery}
            />
        </Layout>
    );
}