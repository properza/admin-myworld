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
import {
  getStock,
  StockDataWithItemNo,
  StockResponse,
} from "~/models/stock.server";
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
import StockModal from "./StockModal";

export type StockTableData = Prettify<
  Omit<StockResponse, "data"> & {
    data: StockDataWithItemNo[]; // Don't omit "id" here
  }
>;

interface StockTableProps {
  data: StockTableData;
  accessToken: string;
}

function StockTable({ data, accessToken }: StockTableProps): JSX.Element {
  const columnHelper = createColumnHelper<StockTableData["data"][number]>();
  const [isOpen, setIsOpen] = useState(false);
  const [thisStockId, setthisStockId] = useState<number>();
  const [thisStock, setthisStock] = useState<number>();
  const [thisTitle, setthisTitle] = useState<string>();
  const [thisPrice, setthisPrice] = useState<number>();
  const [thisImageUrls, setthisImageUrls] = useState<string>();


  
  const columns = useMemo(
    () => [
      columnHelper.accessor("itemNo", {
        header: () => "No.",
        cell: (info) => info.getValue(),
        size: 56,
      }),
      columnHelper.accessor("name", {
        header: () => "ชื่อสินค้า",
        cell: (info) => <p className="text-[#0047FF]">{info.getValue()}</p>,
      }),

      columnHelper.accessor("variant", {
        header: () => "Variants",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("price", {
        header: () => "ราคา",
        cell: (info) => (
          <div className="text-center">
            <span>{info.getValue()}</span>
          </div>
        ),
      }),

      columnHelper.accessor("isDisplay", {
        header: () => "Display",
        cell: (info) => {
          return (
            <p className={info.getValue() ? "text-green-400" : "text-red-400"}>
              {info.getValue() ? "Public" : "Unpublic"}
            </p>
          );
        },
      }),
      // columnHelper.accessor("sold", {
      //   header: () => "ราคาต่อชิ้น",
      //   cell: (info) => {
      //     const date = info.getValue();
      //     return <span className="text-nowrap"></span>;
      //   },
      // }),
      columnHelper.accessor("stock", {
        header: () => "จำนวนสต๊อก(ชิ้น)",
        cell: (info) => (
          <div className="text-end">
            <span>{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor("sold", {
        header: () => "ขายได้",
        cell: (info) => (
          <div className="text-end">
            <span>{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor("remain", {
        header: () => "คงเหลือ",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("id", {
        header: () => "อัปเดต",
        cell: (info) => {
          return (
            <div className="text-center">
              <button
                onClick={() => {
                  setIsOpen(true);
                  setthisStockId(info.row.original.id);
                  setthisStock(info.row.original.stock ?? 0);
                  setthisTitle(info.row.original.name);
                  setthisPrice(info.row.original.price);
                  setthisImageUrls(info.row.original.imageUrls)
                }}
              >
                <img src="/images/edit.svg" alt="" />
              </button>
            </div>
          );
        },
      }),
    ],
    [data],
  );

  useEffect(() => {
    console.log(table.getPageCount())
    console.log('data',data)
  },[])
  const table = useReactTable({
    data: data.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  // console.log(thisStockId);
  return (
    <div className="w-full h-full flex flex-col">
      <StockModal
        title={thisTitle}
        price={thisPrice}
        imageUrls={thisImageUrls}
        stock_id={thisStockId}
        totalstock={thisStock ?? 0}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        accessToken={accessToken}
      />
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
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>

        <PaginationNavigator
          currentPage={table.getState().pagination.pageIndex + 1}
          totalPage={table.getPageCount()}
          setPageIndex={table.setPageIndex}
        />
      </div>
    </div>
  );
}

export default StockTable;
