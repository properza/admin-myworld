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
  Form,
  useActionData,
  useNavigate,
  useRevalidator,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import TradeUpdateStatus from "./TradeUpdateStatus";

const columnHelper = createColumnHelper<TradeTableData["data"][number]>();

export type TradeTableData = Prettify<
  Omit<TradeResponse, "data"> & {
    data: Omit<TradesWithItemNo, "order" | "trade">[];
  }
>;

interface TradeTableProps {
  data: TradeTableData;
  filter: string;
  accessToken: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}
function TradeListTable({
  data,
  filter,
  setFilter,
  accessToken,
}: TradeTableProps): JSX.Element {
  let today = new Date();
  let sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  const submit = useSubmit();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentpage = +(searchParams.get("page") || "1");
  const [value, setValue] = useState<any>({
    startDate: sevenDaysAgo,
    endDate: new Date(),
  });

  function handleValueChange(newValue: any) {
    // console.log("handleValueChange", newValue);
    setValue(newValue);
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor("itemNo", {
        header: () => "No.",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("orderNumber", {
        header: () => "หมายเลขออเดอร์",
        cell: (info) => {
          return <p className="text-red-500">{info.getValue()}</p>;
        },
      }),
      columnHelper.accessor("customer.name", {
        header: () => "ชื่อผู้ใช้",
        cell: (info) => info.getValue() ?? "-",
      }),
      columnHelper.accessor("merchandise.point", {
        header: () => "ชื่อสินค้า",
        cell: (info) => info.getValue() ?? "-",
      }),
      columnHelper.accessor("totalPrice", {
        header: () => "ราคา (บาท)",
        cell: (info) => info.getValue() ?? "-",
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
      columnHelper.accessor("approve_status", {
        header: () => "ตรวจสอบ",
        cell: (info) => {
          return (
            <TradeUpdateStatus
              id={info.row.original.order_id}
              approve_status={info.getValue()}
              accessToken={accessToken}
            />
          );
        },
      }),
    ],
    [data],
  );
  const table = useReactTable({
    data: data && Array.isArray(data.data) ? data.data : [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

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

      {/* footer */}

      <div className="flex justify-between items-center gap-2 mt-2 mb-16">
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {currentpage} of {data.totalPage}
          </strong>
        </span>

        <PaginationNavigator
          currentPage={currentpage}
          totalPage={data.totalPage}
          setPageIndex={(e) => {
            navigate(`/trades?page=${e + 1}`, { replace: true });
          }}
        />
      </div>
    </div>
  );
}

export default TradeListTable;
