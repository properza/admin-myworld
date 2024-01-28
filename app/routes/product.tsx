import { MetaFunction } from "@remix-run/node";
import { useLocation } from "@remix-run/react";

import Layout from "~/components/Layout";

export const meta: MetaFunction = () => [{ title: "My Beer | Product" }];

export default function Product (): JSX.Element {
  const location = useLocation();

  return (
    <Layout title="Product" isSubRoute={false} returnRoute="" pathname={location.pathname}>
      <div className="border-b-2">
        <div className="m-5 flex justify-between">
          <div className="flex flex-col space-y-1">
            <p className="text-base text-bold">Products</p>
            <p className="text-sm">กดปุ่มเพื่อจัดการสินค้า My Beer ที่ LINE Shopping</p>
          </div>

          <a href="/" className="flex rounded-md bg-[#009fc9] px-4 py-3 gap-x-2">
            <img src="/images/external-link.svg" alt="External Link" draggable="false" />
            <p className="text-base text-white font-normal">Product Management</p>
          </a>
        </div>
      </div>
    </Layout>
  )
}
