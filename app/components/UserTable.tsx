import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { parseISO, format } from "date-fns";
import { Dispatch, SetStateAction } from "react";

import { UserMetadata } from "~/models/user.server";
import { classNames } from "~/tailwind";

import CreateButton from "./CreateButton";
import EmptyState from "./EmptyState";
import PaginationNavigator from "./PaginationNavigator";
import Search from "./Search";

const columnHelper = createColumnHelper<UserWithItemNo>();

const columns = [
  columnHelper.accessor("itemNo", {
    header: "No.",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("name", {
    header: "ชื่อผู้ใช้",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("id", {
    id: "access",
    header: "สิทธิ์เข้าถึง",
    cell: "Admin",
  }),
  columnHelper.accessor("email", {
    header: "อีเมล",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("phoneNumber", {
    header: "เบอร์โทร",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("createdAt", {
    header: "วันที่สร้าง",
    cell: (info) => format(parseISO(info.getValue()), "dd/MM/yyyy"),
  }),
  /* columnHelper.accessor((row) => ({ id: row.id, canDelete: row.canDelete }), {
		id: "manage",
		header: "จัดการ",
		cell: (info) => (
			<TrashButton
				id={info.getValue().id}
				display={info.getValue().canDelete}
			/>
		),
	}), */
];

export interface UserWithItemNo {
  itemNo: number;
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  canDelete: boolean;
  createdAt: string;
}

interface UserTableProps {
  data: UserTableData;
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
}

type UserTableData = UserMetadata & { data: UserWithItemNo[] };

function UserTable({ data, filter, setFilter }: UserTableProps): JSX.Element {
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

        <div className="flex flex-row gap-x-3">
          <Search filter={filter} setFilter={setFilter} />
          {/* <CreateButton /> */}
        </div>
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
    </div>
  );
}

interface TrashButtonProps {
  id: string;
  display: boolean;
}

function TrashButton({ display }: TrashButtonProps): JSX.Element {
  return (
    <>
      {display ? (
        <div className="flex items-center">
          <img
            className="w-5 h-5"
            src="/images/trash.svg"
            alt="Trash"
            draggable="false"
          />
        </div>
      ) : null}
    </>
  );
}

export default UserTable;
