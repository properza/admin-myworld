import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { useState } from "react";

import {
  FrontStoreDataWithItemNo,
  FrontStoreResponse,
} from "~/models/frontStore.server";
import { classNames } from "~/tailwind";
import { Prettify } from "~/utils.type";

import EmptyState from "./EmptyState";
import PaginationNavigator from "./PaginationNavigator";
import PaymentStatusBadge from "./PaymentStatusBadge";
import SlipModal from "./SlipModal";

const columnHelper = createColumnHelper<FrontStoreDataWithItemNo>();

const columns = [
  columnHelper.accessor("itemNo", {
    header: () => "No.",
    cell: (info) => info.getValue(),
    size: 56,
  }),
  columnHelper.accessor("orderNumber", {
    header: () => "หมายเลขออเดอร์",
    cell: (info) => info.getValue(),
    size: 132,
  }),
  columnHelper.accessor("phone", {
    header: () => "ผู้ซื้อ",
    cell: (info) => info.getValue(),
    size: 136,
  }),
  columnHelper.accessor("totalPrice", {
    header: () => "ราคา (บาท)",
    cell: (info) =>
      info.getValue().toLocaleString("th-TH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    size: 136,
  }),
  columnHelper.accessor("point", {
    header: () => "Point",
    cell: (info) => info.getValue(),
    size: 136,
  }),
  columnHelper.accessor("updated_at", {
    header: () => "วันที่อัพเดตล่าสุด",
    cell: (info) =>
      info.getValue()
        ? format(parseISO(info.getValue()!), "dd MMM yyyy HH:mm")
        : "-",
    size: 136,
  }),
  columnHelper.accessor("paymentStatus", {
    header: () => "การชำระเงิน",
    cell: (info) => <PaymentStatusBadge isPaid={info.getValue() === "PAID"} />,
    size: 136,
  }),
  columnHelper.accessor("slipImageUrl", {
    header: () => "ใบเสร็จ",
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
  columnHelper.accessor("manual_by", {
    header: () => "ฝ่ายขาย",
    cell: (info) => info.getValue(),
    size: 136,
  }),
];

interface FrontStoreProps {
  data: FrontStoreData;
}

export type FrontStoreData = Prettify<
  Omit<FrontStoreResponse, "data"> & { data: FrontStoreDataWithItemNo[] }
>;

function FrontStore({ data }: FrontStoreProps): JSX.Element {
  const [isOpenSlip, setIsOpenSlip] = useState<boolean>(false);
  const [selectedSlip, setSelectedSlip] = useState<string>("");
  const table = useReactTable({
    data: data.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full h-full flex flex-col p-4">
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
                      `w-[${header.getSize()}px]`,
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

        {data.totalRow === 0 ? (
          <div className="flex h-full justify-center items-center ">
            <EmptyState />
          </div>
        ) : null}
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
      </div>
      <SlipModal
        isOpen={isOpenSlip}
        closeModal={setIsOpenSlip}
        slip={selectedSlip}
      />
    </div>
  );
}

export default FrontStore;
