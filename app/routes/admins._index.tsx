import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { useLoaderData, useLocation } from "@remix-run/react";
import { useMemo, useState } from "react";

import Layout from "~/components/Layout";
import UserTable, { UserWithItemNo } from "~/components/UserTable";
import { UserMetadata, getUsers } from "~/models/user.server";
import { getUserData, requireUserId } from "~/services/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);

  const { accessToken } = await getUserData(request);
  const users = await getUsers(accessToken);

  return json({ users });
};
export const meta: MetaFunction = () => [{ title: "My Beer | Admin" }];

export default function Admin(): JSX.Element {
  const location = useLocation();

  const { users } = useLoaderData<typeof loader>();

  const [userData, setUserData] = useState<UserWithItemNo[]>([]);
  const [userMetadata, setUserMetadata] = useState<UserMetadata>({
    currentPage: 1,
    perPage: 0,
    totalPage: 1,
    totalRow: 0,
  });
  const [filter, setFilter] = useState<string>("");

  useMemo(() => {
    if (users && users.data) {
      setUserMetadata({
        currentPage: users.currentPage,
        totalPage: users.totalPage,
        totalRow: users.totalRow,
        perPage: users.perPage,
      });

      const data: UserWithItemNo[] = users.data.map((user, index) => ({
        itemNo: (users.currentPage - 1) * users.perPage + index + 1,
        id: user.admin_id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phone,
        canDelete: user.can_delete,
        createdAt: user.created_at,
      }));

      setUserData(data);
    } else {
      setUserMetadata({
        currentPage: 1,
        totalPage: 1,
        totalRow: 0,
        perPage: 10,
      });
      setUserData([]);
    }
  }, [users]);

  return (
    <Layout
      title="Admin"
      isSubRoute={false}
      returnRoute=""
      pathname={location.pathname}
    >
      <UserTable
        data={{ ...userMetadata, data: userData }}
        filter={filter}
        setFilter={setFilter}
      />
    </Layout>
  );
}
