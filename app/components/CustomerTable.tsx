import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import * as React from "react";

import { CustomerResponse, CustomerWithItemNo } from "~/models/customer.server";
import { classNames } from "~/tailwind";
import { Prettify } from "~/utils.type";

import DetailButton from "./DetailButton";
import PaginationCustom from "./PaginationCustom";
import Search from "./Search";
import UsernameSection from "./UserNameSection";

const columnHelper = createColumnHelper<CustomerTableData["data"][number]>();

const columns = [
  columnHelper.accessor("itemNo", {
    header: () => "No.",
    cell: (info) => info.getValue(),
    size: 12,
  }),
  columnHelper.accessor((row) => ({ name: row.name, image: row.picture }), {
    header: "ชื่อผู้ใช้",
    cell: (info) => (
      <UsernameSection
        name={info.getValue().name}
        imageUrl={info.getValue().image}
      />
    ),
    size: 44,
  }),
  columnHelper.accessor("customer_id", {
    header: () => "User ID",
    cell: (info) => info.getValue(),
    size: 44,
  }),
  columnHelper.accessor("email", {
    header: () => "อีเมล",
    cell: (info) => info.getValue(),
    size: 44,
  }),
  columnHelper.accessor("point", {
    header: "Point",
    cell: (info) => info.getValue().toLocaleString(),
    size: 44,
  }),
  columnHelper.accessor("game_point", {
    header: "Game Point",
    cell: (info) => info.getValue().toLocaleString(),
    size: 44,
  }),
  columnHelper.accessor("customer_id", {
    id: "customer_detail",
    header: () => "รายละเอียด",
    cell: (info) => <DetailButton to={`/customers/${info.getValue()}`} />,
    size: 44,
  }),
];

export type CustomerTableData = Prettify<
  Omit<CustomerResponse, "data"> & {
    data: Omit<CustomerWithItemNo, "order" | "trade">[];
  }
>;

interface CustomerTableProps {
  data: CustomerTableData;
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

function CustomerTable({
  data,
  filter,
  setFilter,
  setPage
}: CustomerTableProps): JSX.Element {
  const table = useReactTable({
    data: data.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });


  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-end mb-2">
        <p>ทั้งหมด {data.totalRow}</p>
        <Search filter={filter} setFilter={setFilter} />
      </div>

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

      <div className="flex justify-between items-center gap-2 mt-2 mb-16">
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {data.currentPage} of{" "}
            {data.totalPage}
          </strong>
        </span>

        <PaginationCustom
          currentPage={data.currentPage}
          totalPage={data.totalPage}
          setPageIndex={table.setPageIndex}
          setPage={setPage}
        />
      </div>

      {/* <pre>{JSON.stringify(table.getState().pagination, null, 2)}</pre> */}
    </div>
  );
}

export default CustomerTable;
