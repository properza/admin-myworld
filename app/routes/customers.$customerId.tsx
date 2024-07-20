import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import invariant from "tiny-invariant";

import CustomerDetailsCard from "~/components/CustomerDetailsCard";
import CustomerDetailsNavigation, {
  CustomerDetailRoute,
} from "~/components/CustomerDetailsNavigation";
import Layout from "~/components/Layout";
import { getCustomer } from "~/models/customer.server";
import { getUserData, requireUserId } from "~/services/session.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireUserId(request);
  const { accessToken } = await getUserData(request);

  invariant(params.customerId, "customerId is required");

  const pathname = new URL(request.url).pathname;

  if (!pathname.endsWith("order") && !pathname.endsWith("trade")) {
    return redirect(`/customers/${params.customerId}/order`);
  }

  const customer = await getCustomer(accessToken, params.customerId);
  return json({ customerId: params.customerId, customer });
};

function CustomerDetailsPage(): JSX.Element {
  const location = useLocation();
  const data = useLoaderData<typeof loader>();

  const isOrderRoute = location.pathname.endsWith("order");

  const getSelectedRoute = (): CustomerDetailRoute => {
    return isOrderRoute ? "order" : "trade";
  };

  return (
    <Layout
      title="สมาชิก"
      isSubRoute={true}
      returnRoute="/customers"
      pathname={location.pathname}
    >
      <div className="space-y-4">
        <CustomerDetailsCard
          customer={data.customer}
          showCustomerInfo={isOrderRoute}
        />
        <CustomerDetailsNavigation
          customerId={data.customerId}
          selectedRoute={getSelectedRoute()}
        />
        <Outlet context={data.customer} />
      </div>
    </Layout>
  );
}

export default CustomerDetailsPage;
