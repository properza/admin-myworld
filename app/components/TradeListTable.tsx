import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import PaginationNavigator from "./PaginationNavigator";
import { classNames } from "~/tailwind";
import Search from "./Search";
import { Trades, TradesWithItemNo, TradeResponse } from "~/models/trade.server";
import CustomDropdownStatus from "./CustomDropdownStatus";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { constructURL } from "~/utils";

import Datepicker from "react-tailwindcss-datepicker";
import { Prettify } from "~/utils.type";
import {
  TradeListDataWithItemNo,
  TradeListResponse,
} from "~/models/tradeList.server";
import TradeUpdateStatus from "./TradeUpdateStatus";
import SlipModal from "./SlipModal";

interface TradeListProps {
  data: TradeListData;
  accessToken: string;
}
export type TradeListData = Prettify<
  Omit<TradeListResponse, "data"> & { data: TradeListDataWithItemNo[] }
>;

function TradeListTable({ data, accessToken }: TradeListProps): JSX.Element {
  const columnHelper = createColumnHelper<TradeListData["data"][number]>();
  const columns = [
    columnHelper.accessor("itemNo", {
      header: () => "No.",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("orderNumber", {
      header: () => "หมายเลขออเดอร์",
      cell: (info) => {
        return <p className="text-[#0047FF]">{info.getValue()}</p>;
      },
    }),
    columnHelper.accessor("customer.name", {
      header: () => "ชื่อผู้ใช้",
      cell: (info) => info.getValue() ?? "-",
    }),
    columnHelper.accessor("orderItems", {
      header: () => "ชื่อสินค้า",
      cell: (info) => {
        const orderItems = info.getValue();
        return orderItems.map((item: any) => item.name).join(", ");
      },
    }),
    columnHelper.accessor("totalPrice", {
      header: () => "ราคา (บาท)",
      cell: (info) => info.getValue() ?? "-",
    }),

    columnHelper.accessor("slipImageUrl", {
      header: () => "สลิป",
      cell: (info) => (
        <div className="flex justify-center">
          <img
            src={info.getValue()}
            alt=""
            width="20px"
            height="20px"
            className="cursor-pointer"
          />
        </div>
      ),
      size: 124,
    }),
    columnHelper.accessor("point", {
      header: () => "Point",
      cell: (info) => info.getValue() ?? "-",
    }),
    columnHelper.accessor("updated_at", {
      header: () => "วันที่แลกซื้อ",
      cell: (info) => {
        const date = info.getValue();
        return date;
      },
    }),
    columnHelper.accessor("storefront_status", {
      header: () => "ตรวจสอบ",
      cell: (info) => {
        return (
          <TradeUpdateStatus
            id={info.row.original.order_id}
            approve_status={info.getValue()}
            accessToken={accessToken}
          />
        )
      },
    }),
  ];

  const table = useReactTable({
    data: data.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const [isOpenSlip, setIsOpenSlip] = useState<boolean>(false);
  const [selectedSlip, setSelectedSlip] = useState<string>("");

  return (
    <div className="w-full h-full flex flex-col">
      <div
        className={classNames(
          data.totalRow > 0 ? "overflow-y-auto" : "",
          "md:h-[12.25rem] lg:max-h-[31rem] flex-grow border-gray-400 bg-white",
        )}
      >
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={classNames(
                      `md:max-w-[${header.getSize()}px]`,
                      "flex-grow flex-shrink-0 h-[2.75rem] px-2.5 py-1 bg-gray-200 border-t border-b border-gray-400 justify-start items-center gap-2.5 text-slate-500 text-base text-left font-light font-roboto",
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
                    className={classNames(
                      "flex-grow flex-shrink-0 h-[2.8rem] px-2 py-1 bg-white border-b border-gray-400 justify-start gap-2.5 text-stone-800 text-sm font-normal font-roboto",
                    )}
                    onClick={() => {
                      if (cell.column.id === "slipImageUrl") {
                        setIsOpenSlip(true);
                        setSelectedSlip(cell.getValue() as string);
                      }
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {/* Empty State Here */}
      </div>

      <div className="flex justify-between items-center gap-2 mt-2 mb-16">
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>

        <PaginationNavigator
          currentPage={table.getState().pagination.pageIndex + 1}
          totalPage={table.getPageCount()}
          setPageIndex={table.setPageIndex}
        />
        <SlipModal
          isOpen={isOpenSlip}
          closeModal={setIsOpenSlip}
          slip={selectedSlip}
        />
      </div>
    </div>
  );
}

export default TradeListTable;
