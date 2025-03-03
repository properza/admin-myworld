import { useOutletContext } from "@remix-run/react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";

import { CustomerWithItemNo } from "~/models/customer.server";
import { OrderWithItemNo } from "~/models/order.server";
import { cn } from "~/tailwind";

interface CustomerOrderDetail {
  itemNo: number;
  orderId: string;
  customerName: string;
  productName: string;
  productQuantity: number;
  totalPrice: number;
  pointGained: number;
  paymentStatus: string;
  shipmentStatus: string;
}

const columnHelper = createColumnHelper<CustomerOrderDetail>();

const columns = [
  columnHelper.accessor("itemNo", {
    header: () => "No.",
    cell: (info) => info.getValue(),
    size: 44,
  }),
  columnHelper.accessor("orderId", {
    header: () => "หมายเลขสั่งซื้อ",
    cell: (info) => info.getValue(),
    size: 136,
  }),
  columnHelper.accessor("customerName", {
    header: () => "ชื่อผู้ใช้",
    cell: (info) => info.getValue(),
    size: 128,
  }),
  columnHelper.accessor("productName", {
    header: () => "สินค้า",
    cell: (info) => info.getValue(),
    size: 128,
  }),
  columnHelper.accessor("productQuantity", {
    header: () => "จำนวน",
    cell: (info) => info.getValue(),
    size: 128,
  }),
  columnHelper.accessor("totalPrice", {
    header: () => "ราคา (บาท)",
    cell: (info) =>
      (info.getValue() || 0).toLocaleString("th-TH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    size: 128,
  }),
  columnHelper.accessor("pointGained", {
    header: () => "Gain Point",
    cell: (info) => info.getValue(),
    size: 128,
  }),
  columnHelper.accessor("paymentStatus", {
    header: () => "การชำระเงิน",
    cell: (info) => <PaymentStatusBadge isPaid={isPaid(info.getValue())} />,
    size: 128,
  }),
  columnHelper.accessor("shipmentStatus", {
    header: () => "Shipping",
    cell: (info) => (
      <ShippingStatusBadge isDelivered={isDelivered(info.getValue())} />
    ),
    size: 128,
  }),
];

const isPaid = (value: string) => value === "PAID";
const isDelivered = (value: string) => value === "SHIPPED_ALL";

type CustomerDetail = Omit<CustomerWithItemNo, "order"> & {
  order: OrderWithItemNo[];
};

function CustomerOrderDetailsTable(): JSX.Element {
  const customer = useOutletContext<CustomerDetail>();

  const orders = useMemo(() => {
    const orderDetail: CustomerOrderDetail[] = customer.order.map(
      (eachOrder, index) => ({
        itemNo: index + 1,
        orderId: eachOrder.orderNumber,
        customerName: customer.name,
        productName: eachOrder.orderItems[0].name,
        productQuantity: eachOrder.orderItems[0].quantity,
        totalPrice: eachOrder.totalPrice,
        pointGained: eachOrder.point ?? 0,
        paymentStatus: eachOrder.paymentStatus,
        shipmentStatus: eachOrder.shipmentStatus,
      }),
    );

    return orderDetail;
  }, [customer]);

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={cn(
                    "flex-grow flex-shrink-0 min-w-0 h-[2.75rem] px-2.5 py-1 bg-gray-200 border-y border-gray-400 justify-start items-center gap-2.5 text-slate-500 text-base font-light font-roboto",
                    `w-[${header.getSize()}px]`,
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="flex-grow flex-shrink-0 min-w-0 h-[2rem] px-2.5 bg-white border-b border-gray-400 justify-start items-center gap-2.5 text-stone-800 text-sm text-center font-normal font-roboto"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PaymentStatusBadge({ isPaid }: { isPaid: boolean }): JSX.Element {
  return (
    <div className="w-[7.5rem] h-9 p-2.5 bg-white border-gray-400 justify-start items-center gap-2.5 inline-flex">
      <div
        className={cn(
          isPaid ? "bg-[#cbf4cc]" : "bg-[#f4ebcb]",
          "w-full px-1.5 py-1 rounded-full items-center gap-1 flex",
        )}
      >
        <div className="inline-flex justify-start gap-2">
          <CircleFillIcon
            classNames={isPaid ? "fill-[#1fd831]" : "fill-[#f1bc00]"}
          />
          <p className="self-center text-black text-xs font-normal font-poppins leading-3">
            {isPaid ? "ชำระเงินแล้ว" : "รอชำระเงิน"}
          </p>
        </div>
      </div>
    </div>
  );
}

function ShippingStatusBadge({
  isDelivered,
}: {
  isDelivered: boolean;
}): JSX.Element {
  return (
    <div className="w-[8.5rem] h-9 p-2.5 bg-white border-gray-400 justify-start items-center gap-2.5 inline-flex">
      <div
        className={cn(
          isDelivered ? "bg-[#cbf4cc]" : "bg-[#eeeeee]",
          "w-full px-1.5 py-1 rounded-full items-center gap-1 flex",
        )}
      >
        <div className="inline-flex justify-start gap-2">
          <CircleFillIcon
            classNames={isDelivered ? "fill-[#1fd831]" : "fill-[#b3b7ba]"}
          />
          <p className="self-center text-black text-xs font-normal font-poppins leading-3">
            {isDelivered ? "จัดส่งสำเร็จ" : "ยังไม่ดำเนินการ"}
          </p>
        </div>
      </div>
    </div>
  );
}


function CircleFillIcon({ classNames }: { classNames: string }): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      className={cn("w-4 h-4 relative bi bi-circle-fill", classNames)}
    >
      <circle cx="8" cy="8" r="8"></circle>
    </svg>
  );
}

export default CustomerOrderDetailsTable;
