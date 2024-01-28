import { Link, useOutletContext } from "@remix-run/react"
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { useMemo } from "react"

import { CustomerWithItemNo } from "~/models/customer.server"
import { OrderWithItemNo } from "~/models/order.server"
import { cn } from "~/tailwind"

interface CustomerTradeDetail {
  itemNo: number
  tradeId: string
  customerName: string
  customerPoint: number
  merchandiseName: string
  merchandiseImageUrl: string
  totalPrice: number
  totalPointUsed: number
  remainingPointAfterTrade: number
  shipmentStatus: string
  tradedAt: string
}

const columnHelper = createColumnHelper<CustomerTradeDetail>();

const columns = [
  columnHelper.accessor("itemNo", {
    header: "No.",
    cell: (info) => info.getValue(),
    size: 44
  }),
  columnHelper.accessor("tradeId", {
    header: "หมายเลขสั่งซื้อ",
    cell: (info) => info.getValue(),
    size: 148
  }),
  columnHelper.accessor("tradedAt", {
    header: "วันที่ทำรายการ",
    cell: (info) => info.getValue(),
    size: 148
  }),
  columnHelper.accessor("customerName", {
    header: "ชื่อผู้ใช้",
    cell: (info) => info.getValue(),
    size: 148
  }),
  columnHelper.accessor("merchandiseImageUrl", {
    header: "สินค้า",
    cell: (info) => <ProductImageBox src={info.getValue()} />,
    size: 56
  }),
  columnHelper.accessor("merchandiseName", {
    header: "ชื่อสินค้า",
    cell: (info) => info.getValue(),
    size: 148
  }),
  columnHelper.accessor("totalPrice", {
    header: "ราคา (บาท)",
    cell: (info) => info.getValue().toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    size: 64
  }),
  columnHelper.accessor("totalPointUsed", {
    header: "จำนวน Point ที่ใช้แลก",
    cell: (info) => info.getValue(),
    size: 88
  }),
  columnHelper.accessor("remainingPointAfterTrade", {
    header: "คงเหลือ",
    cell: (info) => info.getValue(),
    size: 148
  }),
  columnHelper.accessor("itemNo", {
    header: "Approve",
    cell: (info) => info.getValue(),
    size: 72
  }),
  columnHelper.accessor("shipmentStatus", {
    header: "Shipping",
    cell: (info) => <ShippingStatusBadge isDelivered={isDelivered(info.getValue())} />,
    size: 124
  }),
  columnHelper.accessor("tradeId", {
    id: "trade_detail",
    header: "รายละเอียด",
    cell: (info) => <TradeDetailButton tradeId={info.getValue()} />,
    size: 112
  })
];

const isDelivered = (value: string) => value === "SHIPPED_ALL";

type CustomerDetail = Omit<CustomerWithItemNo, "order"> & { order: OrderWithItemNo[] }

function CustomerTradeDetailsTable (): JSX.Element {
  const customer = useOutletContext<CustomerDetail>();

  const trades = useMemo(() => {
    const tradeDetail: CustomerTradeDetail[] = customer.trade.map((eachTrade, index) => ({
      itemNo: index + 1,
      tradeId: eachTrade.trade_number,
      customerName: customer.name,
      customerPoint: customer.point,
      merchandiseName: eachTrade.merchandise.name,
      merchandiseImageUrl: eachTrade.merchandise.picture,
      totalPrice: eachTrade.merchandise.price,
      totalPointUsed: eachTrade.point,
      remainingPointAfterTrade: customer.point - eachTrade.point,
      shipmentStatus: [eachTrade.shipment_status, "LOL"][Math.round(Math.random())],
      tradedAt: eachTrade.created_at
    }));

    return tradeDetail;
  }, [customer]);
  
  const table = useReactTable({
    data: trades,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className="w-full">
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className={cn("flex-grow flex-shrink-0 min-w-0 h-[2.75rem] px-2.5 py-1 bg-gray-200 border-y border-gray-400 justify-start items-center gap-2.5 text-slate-500 text-base font-light font-roboto", `w-[${header.getSize()}px]`)}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="flex-grow flex-shrink-0 min-w-0 h-[2rem] px-2.5 bg-white border-b border-gray-400 justify-start items-center gap-2.5 text-stone-800 text-sm text-center font-normal font-roboto">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ProductImageBox ({ src }: { src: string }): JSX.Element {
  return <img className="w-[27px] h-[27px] border border-gray-400" src={src} alt="Merchandise" draggable="false" />
}

function ShippingStatusBadge ({ isDelivered }: { isDelivered: boolean }): JSX.Element {
  return (
    <div className="w-[8.5rem] h-9 p-2.5 bg-white border-gray-400 justify-start items-center gap-2.5 inline-flex">
    <div className={cn(isDelivered ? "bg-[#cbf4cc]" : "bg-[#eeeeee]", "w-full px-1.5 py-1 rounded-full items-center gap-1 flex")}>
      <div className="inline-flex justify-start gap-2">
        <CircleFillIcon classNames={isDelivered ? "fill-[#1fd831]" : "fill-[#b3b7ba]"} />
        <p className="self-center text-black text-xs font-normal font-poppins leading-3">{isDelivered ? "จัดส่งสำเร็จ" : "ยังไม่ดำเนินการ" }</p>
      </div>
    </div>
  </div>
  )
}

function TradeDetailButton ({ tradeId }: { tradeId: string }): JSX.Element {
  return (
    <div className="h-6 px-1.5 py-0.5 bg-white rounded border border-sky-400 justify-start items-center gap-1 inline-flex">
      <Link to={tradeId} className="text-sky-400 text-xs font-normal font-roboto">ดูรายละเอียด</Link>
      <img src="/images/chevron-down.svg" alt="More options" className="w-2 h-2 justify-center items-center" draggable="false" />
    </div>
  )
}

function CircleFillIcon ({ classNames }: { classNames: string }): JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className={cn("w-4 h-4 relative bi bi-circle-fill", classNames)}>
      <circle cx="8" cy="8" r="8"></circle>
    </svg>
  )
}

export default CustomerTradeDetailsTable;
