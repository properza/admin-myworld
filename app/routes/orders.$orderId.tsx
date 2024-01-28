import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useLocation } from "@remix-run/react";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import invariant from "tiny-invariant";

import Layout from "~/components/Layout";
import { OrderItemWithItemNo, getOrder } from "~/models/order.server";
import { getUserData, requireUserId } from "~/services/session.server";
import { classNames } from "~/tailwind";
import { getThaiTimestamp } from "~/utils";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireUserId(request);
  const { accessToken } = await getUserData(request);

  invariant(params.orderId, "orderId is required");

  const order = await getOrder(accessToken, params.orderId);
  return json({ orderId: params.orderId, order });
}

const columnHelper = createColumnHelper<OrderItemWithItemNo>();

const columns = [
  columnHelper.accessor("itemNo", {
    header: "ลำดับ",
    cell: (info) => info.getValue(),
    size: 16
  }),
  columnHelper.accessor((row) => ({
    productName: row.name,
    productImage: row.imageURL,
    productVariant: row.variantId
  }), {
    id: "product",
    header: "สินค้า",
    cell: (info) =>
      <ProductBox
        productName={info.getValue().productName}
        productImage={info.getValue().productImage}
        productVariant={info.getValue().productVariant}
      />,
    size: 256
  }),
  columnHelper.accessor("quantity", {
    header: "จำนวน",
    cell: (info) => info.getValue(),
    size: 32
  }),
  columnHelper.accessor("price", {
    header: "ราคาต่อหน่วย",
    cell: (info) => "฿" + info.getValue().toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    size: 32
  }),
];

function OrderDetailsPage (): JSX.Element {
  const { order } = useLoaderData<typeof loader>();

  const [orderData, setOrderData] = useState<OrderItemWithItemNo[]>([]);

  const location = useLocation();

  useMemo(() => {
    if (order && order.orderItems) {
      const data: OrderItemWithItemNo[] = order.orderItems.map((orderItem, index) => ({
        ...orderItem,
        itemNo: index + 1
      }));

      setOrderData(data);
    } else {
      setOrderData([]);
    }
  }, [order]);

  const table = useReactTable({
    data: orderData,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <Layout title="รายละเอียดคำสั่งซื้อ" isSubRoute={true} returnRoute={"/orders"} pathname={location.pathname}>
      <div className="flex flex-col p-5">
        <div className="flex gap-2.5">
          <p className="text-xl text-blackrose font-semibold">{order.orderNumber}</p>
          
          <PaymentStatusBadge status={order.paymentStatus} />
          <ShipmentStatusBadge status={order.shipmentStatus} />
        </div>

        <div className="grid grid-cols-4 mt-4 gap-4">
          <div className="w-full col-span-3 bg-white rounded-xl">
            <div className="flex justify-between p-6">
              <p className="text-base font-medium">รายการสั่งซื้อ</p>
              <div className="flex flex-col items-end text-sm text-slate-500">
                <p>ยืนยันการสั่งซื้อล่าสุด: {getThaiTimestamp(order.checkoutAt)}</p>
                <p>อัปเดตล่าสุด: {getThaiTimestamp(order.lastUpdatedAt)}</p>
              </div>
            </div>

            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header, index) => (
                      <th key={header.id} className={classNames(index === 0 || index === 2 ? "text-center" : index === 3 ? "text-right" : "", `w-[${header.getSize()}px]`, "flex-grow flex-shrink-0 h-[3.5rem] px-6 bg-white border-t border-b border-gray-400 justify-start items-center gap-2.5 text-slate-500 text-base text-left font-light font-roboto")}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell, index) => (
                      <td
                        key={cell.id}
                        className={classNames(
                          index === 0 || index === 2 ?
                          "text-center" : index === 3 ?
                          "text-right" : "",
                          "flex-grow flex-shrink-0 h-[2.5rem] px-6 bg-white text-sm text-slate-500 font-normal font-roboto"
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex flex-row justify-end p-6">

              <div className="flex flex-col w-[25rem] text-sm text-slate-500 font-normal space-y-1">
                <div className="flex justify-between">
                  <p>ยอดรวม</p>
                  <p>฿{order.subtotalPrice.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>

                <div className="flex justify-between">
                  <p>ค่าจัดส่ง</p>
                  <p>฿{order.shipmentPrice.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>

                <div className="border-b border-slate-800" />

                <div className="flex justify-between text-base font-medium text-slate-700">
                  <p>รวมทั้งสิ้น</p>
                  <p>฿{order.totalPrice.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>

                <div className="border-b border-slate-800" />
                <div className="border-b-2 border-slate-800" />
              </div>
            </div>

          </div>

          <div className="cols-span-1 flex flex-col gap-y-3">

            <div className={classNames(order.paymentStatus === "PAID" ? "h-[8rem]" : "h-[4rem]", "bg-white rounded-xl p-5 space-y-3")}>
              <div className="space-y-3">
                <div className="flex flex-row justify-between">
                  <p>การชำระเงิน</p>
                  <PaymentStatusBadge status={order.paymentStatus} />
                </div>

                {order.paymentStatus === "PAID" ? (
                  <div className="flex flex-row gap-x-4">
                    <div className="w-12 h-12 rounded-full border bg-[#00427a] border-slate-300 flex items-center justify-center">
                      <img className="w-8 h-8 border-slate-300" src="/images/promptpay.svg" alt="Payment Logo" draggable="false" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-sm text-slate-700">{getPaymentMethod(order.paymentMethod)}</p>
                      <p className="text-sm text-slate-500">ผ่าน LINE Shopping</p>
                    </div>
                  </div> ) : null
                }
              </div>
            </div>
          

            <div className="h-auto bg-white rounded-xl p-5 space-y-3">
              <div>
                <div className="flex flex-row justify-between">
                  <p>ที่อยู่จัดส่ง</p>
                  <ShipmentStatusBadge status={order.shipmentStatus} />
                </div>
              </div>

              <div className="text-sm text-[#7a7a7a] font-normal space-y-1">
                <p>ชื่อผู้รับ: {order.shippingAddress.recipientName}</p>
                <p>ที่อยู่: {order.shippingAddress.address}</p>
                <p>เบอร์โทร: {order.shippingAddress.phoneNumber}</p>
                <p>อีเมล: {order.shippingAddress.email ? order.shippingAddress.email : "-"}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  )
}

interface ProductBoxProps {
  productName: string
  productImage: string
  productVariant: number
}

function ProductBox ({ productName, productImage }: ProductBoxProps): JSX.Element {
  return (
    <div className="flex flex-row m-2 space-x-2 items-center">
      <div className="w-12 h-12 rounded-md border bg-[#f2f3f4] items-center">
        <img className="w-12 h-12" src={productImage} alt="Product" draggable="false" />
      </div>

      <div>
        <p className="text-slate-700">{productName}</p>
      </div>
    </div>
  )
}

function PaymentStatusBadge ({ status }: { status: string }): JSX.Element {
  const isCompleted = status === "PAID";

  return (
    <div className={classNames(isCompleted ? "bg-[#c9f6df] text-[#187a41]": "bg-[#f4ebcb] text-yellow-700", "flex px-2 rounded-2xl font-light text-xs items-center justify-center")}>
      {isCompleted ? "ชำระเงินแล้ว" : "รอชำระเงิน"}
    </div>
  )
}

function ShipmentStatusBadge ({ status }: { status: string }): JSX.Element {
  const isShipped = status === "SHIPPED_ALL";

  return (
    <div className={classNames(isShipped ? "bg-[#c9f6df] text-[#187a41]" : "bg-[#f4ebcb] text-yellow-700", "flex px-2 rounded-2xl font-light text-xs items-center justify-center")}>
      {isShipped ? "จัดส่งสำเร็จ" : "ยังไม่ดำเนินการ"}
    </div>
  )
}

function getPaymentMethod (paymentMethod: string): string {
  if (paymentMethod === "CREDIT_CARD") {
    return "บัตรเครดิต/เดบิต LINE Pay"
  }

  return "PromptPay พร้อมเพย์"
}

export default OrderDetailsPage;
