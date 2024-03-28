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
import DetailButton from "./DetailButton";
import { FC, useEffect, useMemo, useRef, useState } from "react";

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

const columnHelper = createColumnHelper<TradeTableData["data"][number]>();

export type TradeTableData = Prettify<
  Omit<TradeResponse, "data"> & {
    data: Omit<TradesWithItemNo, "order" | "trade">[];
  }
>;

interface TradeTableProps {
  data: TradeTableData;
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}

function HistoryTable({
  data,
  filter,
  setFilter,
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
    console.log("handleValueChange", newValue);
    setValue(newValue);
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor("itemNo", {
        header: () => "No.",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("trade_id", {
        header: () => "ชื่อสินค้า",
        cell: (info) => <p className="text-[#0047FF]">{info.getValue()}</p>,
      }),

      columnHelper.accessor("customer.name", {
        header: () => "Variants",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor(
        (row) => ({
          name: "kkk",
          image: "",
        }),
        {
          id: "merchandise_info",
          header: () => "Display",
          cell: (info) => (
            <div className="flex gap-1 items-center">
              <span>{info.getValue().name}</span>
            </div>
          ),
        },
      ),
      columnHelper.accessor("merchandise.point", {
        header: () => "ราคา (บาท)",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("merchandise.point", {
        header: () => "Action",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("created_at", {
        header: () => "จำนวน",
        cell: (info) => {
          const date = info.getValue();
          return <span className="text-nowrap"></span>;
        },
      }),
      columnHelper.accessor("created_at", {
        header: () => "จำนวนสต๊อก(ชิ้น)",
        cell: (info) => {
          const date = info.getValue();
          return <span className="text-nowrap"></span>;
        },
      }),
      columnHelper.accessor("created_at", {
        header: () => "วันที่ทำรายการ",
        cell: (info) => {
          const date = info.getValue();
          return <span className="text-nowrap"></span>;
        },
      }),
      columnHelper.accessor("approve_status", {
        header: () => "เพิ่ม Stock โดย",
      }),
    ],
    [data],
  );
  const table = useReactTable({
    data: data.data,
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
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={classNames(
                        "flex-grow flex-shrink-0 h-[2.8rem] px-2 py-1 bg-white border-b border-gray-400 justify-start gap-2.5 text-stone-800 text-sm font-normal font-roboto",
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr className="mt-[10px]">
                <td className="text-center " colSpan={columns.length}>
                  No data
                </td>
              </tr>
            )}
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
          setPageIndex={(e: any) => {
            navigate(`/stock?page=${e + 1}`, { replace: true });
          }}
        />
      </div>
    </div>
  );
}

export default HistoryTable;
