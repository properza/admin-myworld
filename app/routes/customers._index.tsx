import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { useLoaderData, useLocation, useSearchParams } from "@remix-run/react";
import { useState, useEffect, useMemo } from "react";

import CustomerTable from "~/components/CustomerTable";
import Layout from "~/components/Layout";
import {
  CustomerMetadata,
  CustomerWithItemNo,
  getCustomers,
} from "~/models/customer.server";
import { getUserData, requireUserId } from "~/services/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);

  const { accessToken } = await getUserData(request);
  const { searchParams } = new URL(request.url);

  const filter = searchParams.get("filter");
  const page = searchParams.get("page");

  const customers = await getCustomers(accessToken, {
    search: filter,
    page: page,
    perPage: 10,
  });

  return json({ customers });
};

export const meta: MetaFunction = () => [{ title: "My Beer | Customer" }];

function CustomerIndexPage(): JSX.Element {
  const { customers } = useLoaderData<typeof loader>();

  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [customerData, setCustomerData] = useState<CustomerWithItemNo[]>([]);
  const [customerMetadata, setCustomerMetadata] = useState<CustomerMetadata>({
    currentPage: 0,
    perPage: 0,
    totalPage: 0,
    totalRow: 0,
  });
  const [filterQuery, setFilterQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  useMemo(() => {
    if (customers && customers.data) {
      setCustomerMetadata({
        currentPage: customers.currentPage,
        totalPage: customers.totalPage,
        totalRow: customers.totalRow,
        perPage: customers.perPage,
      });

      const data: CustomerWithItemNo[] = customers.data.map(
        (customer, index) => ({
          ...customer,
          itemNo: (customers.currentPage - 1) * customers.perPage + index + 1,
        }),
      );

      setCustomerData(data);
      setPage(customers.currentPage); // Update page state with currentPage from customers data
    } else {
      setCustomerMetadata({
        currentPage: 1,
        totalPage: 1,
        totalRow: 0,
        perPage: 10,
      });
      setCustomerData([]);
      setPage(1); // Reset page state to 1
    }
  }, [customers]);

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

  return (
    <Layout
      title="สมาชิก"
      isSubRoute={false}
      returnRoute=""
      pathname={location.pathname}
    >
      <CustomerTable
        data={{ ...customerMetadata, data: customerData }}
        filter={filterQuery}
        setFilter={setFilterQuery}
        setPage={setPage}
      />
    </Layout>
  );
}

export default CustomerIndexPage;