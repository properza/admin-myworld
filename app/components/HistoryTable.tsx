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
  HistoryStockDataWithItemNo,
  HistoryStockResponse,
} from "~/models/stock.server";
import { Prettify } from "~/utils.type";
import {
  Form,
  useActionData,
  useNavigate,
  useRevalidator,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import { useMemo } from "react";

const columnHelper = createColumnHelper<HistoryTableData["data"][number]>();

export type HistoryTableData = Prettify<
  Omit<HistoryStockResponse, "data"> & {
    data: HistoryStockDataWithItemNo[];
  }
>;

interface HistoryTableProps {
  data: any;
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  accessToken: string;
}

function HistoryTable({
  data,
  filter,
  setFilter,
  accessToken,
}: HistoryTableProps): JSX.Element {
  let today = new Date();
  let sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  const submit = useSubmit();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentpage = +(searchParams.get("page") || "1");

  const columns = useMemo(
    () => [
      columnHelper.accessor("imageUrls", {
        header: () => "ชื่อสินค้า",
        cell: (info) => {
          return (
            <div className="flex">
              <img
                src={info.row.original.imageUrls}
                className="w-[50px] h-[50px] mr-3"
                alt=""
              />
              <p className="text-[#0047FF]">{info.row.original.name}</p>
            </div>
          );
        },
      }),

      columnHelper.accessor("sku", {
        header: () => "Variants",
        cell: (info) => info.getValue(),
      }),
      
      // columnHelper.accessor("isDisplay", {
      //   header: () => "Display",
      //   cell: (info) => {
      //     return (
      //       <p className={info.getValue() ? "text-green-400" : "text-red-400"}>
      //         {info.getValue() ? "Public" : "Unpublic"}
      //       </p>
      //     );
      //   },
      // }),
     
      columnHelper.accessor("price", {
        header: () => "ราคาต่อชิ้น",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("type", {
        header: () => "Action",
        cell: (info) => info.getValue(),
      }),

      columnHelper.accessor("value", {
        header: () => "จำนวน",
        cell: (info) => new Intl.NumberFormat().format(info.getValue()),
      }),

      columnHelper.accessor("stock", {
        header: () => "จำนวนสต๊อก(ชิ้น)",
        cell: (info) => new Intl.NumberFormat().format(info.getValue()),
      }),
      columnHelper.accessor("admin_name", {
        header: () => "เพิ่มโดย",
        cell: (info) => info.getValue(),
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
  // console.log(thisHistoryId);
  return (
    <div className="w-full h-full flex flex-col">
      <div>
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                <th className="flex-grow flex-shrink-0 h-[2.75rem] px-2.5 py-1 bg-gray-200 border-t border-b border-gray-400 justify-start items-center gap-2.5 text-slate-500 text-base text-left font-light font-roboto">
                  No.
                </th>
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
              table.getRowModel().rows.map((row, i) => (
                <tr key={row.id}>
                  <td
                    className={classNames(
                      "flex-grow flex-shrink-0 h-[2.8rem] px-2 py-1 bg-white border-b border-gray-400 justify-start gap-2.5 text-stone-800 text-sm font-normal font-roboto",
                    )}
                  >
                    {i + 1}
                  </td>
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
