import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
} from "@remix-run/node";
import { useLoaderData, useLocation } from "@remix-run/react";
import { useEffect, useMemo, useState } from "react";

import Layout from "~/components/Layout";
import RewardTable from "~/components/RewardTable";
import config from "~/config";
import { getUserData, requireUserId } from "~/services/session.server";
import { constructURL } from "~/utils";

export const meta: MetaFunction = () => [{ title: "My Beer | Product Reward" }];
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);

  const { accessToken } = await getUserData(request);
  const { searchParams } = new URL(request.url);

  const page = searchParams.get("page");
  try {
    const response = await fetch(
      constructURL(config.api.baseUrl, "merchandises/administrator"),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) throw {};
    const data = await response.json();
    return json({ orders: data });
  } catch (error) {
    return json({ orders: [] });
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireUserId(request);
  const formData = await request.formData();

  await requireUserId(request);

  const { accessToken } = await getUserData(request);

  const method = formData.get("method");
  try {
    if (method === "create") {
      const name = formData.get("name");
      const picture = formData.get("picture");
      const title1 = formData.get("title1");
      const title2 = formData.get("title2");
      const description = formData.get("description");
      const piece = formData.get("piece");
      const point = formData.get("point");
      const redeem_per_customer = formData.get("redeem_per_customer");
      const start_date = formData.get("start_date");
      const end_date = formData.get("end_date");
      let img = null;
      if (picture) {
        try {
          const formData = new FormData();
          formData.append("file", picture);
          const response = await fetch(
            constructURL(config.api.baseUrl, "upload/file"),
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              body: formData,
            },
          );
          if (!response.ok) throw new Error("error has occured");
          const data = await response.json();
          img = data?.url;
        } catch (e) {}
      }
      const response = await fetch(
        constructURL(config.api.baseUrl, "merchandises"),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name || "",
            title1: title1 || "",
            title2: title2 || "",
            description: description || "",
            piece: +(piece || 0),
            point: +(point || 0),
            redeem_per_customer: +(redeem_per_customer || 0),
            start_date: start_date || "",
            end_date: end_date || "",
            picture: img,
          }),
        },
      );
      if (!response.ok) throw new Error("error has occured");
      return json({ success: 1 });
    }
    if (method === "edit") {
      const name = formData.get("name");
      const picture = formData.get("picture");
      const title1 = formData.get("title1");
      const title2 = formData.get("title2");
      const description = formData.get("description");
      const piece = formData.get("piece");
      const point = formData.get("point");
      const redeem_per_customer = formData.get("redeem_per_customer");
      const start_date = formData.get("start_date");
      const end_date = formData.get("end_date");
      const id = formData.get("id");
      const original_image = formData.get("original_image");

      let img = original_image;
      if (picture) {
        try {
          const formData = new FormData();

          formData.append("file", picture);
          const response = await fetch(
            constructURL(config.api.baseUrl, "upload/file"),
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              body: formData,
            },
          );
          if (!response.ok) throw new Error("error has occured");
          const data = await response.json();
          img = data?.url;
        } catch (e) {}
      }
      const response = await fetch(
        constructURL(config.api.baseUrl, `merchandises/${id}`),
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name || "",
            title1: title1 || "",
            title2: title2 || "",
            description: description || "",
            piece: +(piece || 0),
            point: +(point || 0),
            redeem_per_customer: +(redeem_per_customer || 0),
            start_date: start_date || "",
            end_date: end_date || "",
            picture: img,
          }),
        },
      );
      if (!response.ok) throw new Error("error has occured");
      return json({ success: 1 });
    }
    if (method === "delete") {
      const id = formData.get("id");

      const response = await fetch(
        constructURL(config.api.baseUrl, `merchandises/${id}`),
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) throw new Error("error has occured");
      return json({ success: 1 });
    }
    if (method === "changeVisibility") {
      const id = formData.get("id");
      const is_publish = formData.get("is_publish");
      const response = await fetch(
        constructURL(config.api.baseUrl, `merchandises/${id}/publish`),
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_publish: is_publish === "true" ? true : false,
          }),
        },
      );
      if (!response.ok) throw new Error("error has occured");
      return json({ success: 1 });
    }
    throw {};
  } catch (error) {
    console.log(error);
    return json({ error: "error has occured" }, { status: 400 });
  }
};

export default function Reward(): JSX.Element {
  const location = useLocation();
  const { orders } = useLoaderData<typeof loader>();

  const [rewardData, setRewardData] = useState<any[]>([]);

  useEffect(() => {
    if (orders) {
      console.log(orders);
      setRewardData(orders);
    } else {
      setRewardData([]);
    }
  }, [orders]);
  return (
    <Layout title="Reward" pathname={location.pathname}>
      <RewardTable data={rewardData}></RewardTable>
    </Layout>
  );
}
