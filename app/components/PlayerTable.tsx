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
import { Trades,TradesWithItemNo,TradeResponse } from "~/models/trade.server";
import CustomDropdownStatus from "./CustomDropdownStatus";
import { FC,useEffect,useMemo,useRef,useState } from "react";
import { constructURL } from "~/utils";

import Datepicker from "react-tailwindcss-datepicker";
import { Prettify } from "~/utils.type";
import {
  PlayersDataWithItemNo,
  PlayersResponse,
} from "~/models/players.server";
import TradeUpdateStatus from "./TradeUpdateStatus";
import SlipModal from "./SlipModal";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import DetailButton from "./DetailButton";
import DropdownSelect from "./DropdownSelect";

interface PlayerProps {
  data: PlayersData;
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}

export type PlayersData = Prettify<
  Omit<PlayersResponse,"data"> & { data: PlayersDataWithItemNo[] }
>;

const options = [
  {
    name: "ปกติ",
    value: "001",
  },
  {
    name: "แบน 3 วัน",
    value: "002",
  },
  {
    name: "แบน 1 อาทิตย์",
    value: "003",
  },
  {
    name: "แบน 1 เดือน",
    value: "004",
  },
  {
    name: "แบนบัญชีผู้เล่น",
    value: "005",
  },
];
const columnHelper = createColumnHelper<PlayersData["data"][number]>();
const columns = [
  columnHelper.accessor("itemNo",{
    header: () => "No.",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("name",{
    header: () => "ชื่อผู้ใช้",
    cell: (info) => {
      return <p className="text-[#0047FF]">{info.getValue()}</p>;
    },
  }),
  columnHelper.accessor("customer_id",{
    header: () => "User ID",
    cell: (info) => info.getValue() ?? "-",
  }),

  columnHelper.accessor("email",{
    header: () => "Start date",
    cell: (info) => info.getValue() ?? "-",
  }),
  columnHelper.accessor("created_at",{
    header: () => "Start date",
    cell: (info) => info.getValue() ?? "-",
  }),

  columnHelper.accessor("game_level",{
    header: () => "Game Level",
    cell: (info) => info.getValue() ?? "-",
  }),
  columnHelper.accessor("game_point",{
    header: () => "Game Point",
    cell: (info) => {
      const date = info.getValue();
      return date;
    },
  }),
  columnHelper.accessor("point",{
    header: () => "All point",
    cell: (info) => {
      const date = info.getValue();
      return date;
    },
  }),

  columnHelper.accessor("customer_id",{
    header: () => "สถานะ",
    cell: (info) => {
      
      return <DetailButton to={`/player/${info.getValue()}/detail`} />;
    },
  }),
];


function PlayerTable({
  data,
  filter,
  setFilter,
}: PlayerProps): JSX.Element {
  let today = new Date();
  let sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  const [value,setValue] = useState<any>({
    startDate: sevenDaysAgo,
    endDate: new Date(),
  });


  const [selectedOption,setSelectedOption] = useState("001");


  function handleValueChange(newValue: any) {
    console.log("handleValueChange",newValue);
    setValue(newValue);
  }


  const table = useReactTable({
    data: data.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 50 } },
  });


  return (

    <div className="w-full h-full flex flex-col ">
      <div className="flex justify-between items-end mb-4">
        <p>ผู้เล่นเกมส์ทั้งหมด ({data.totalRow})</p>
        <div className="flex flex-row gap-x-3">
          <Datepicker
            primaryColor={"blue"}
            value={value}
            onChange={handleValueChange}
          />
          <DropdownSelect
            selected={selectedOption}
            setSelected={setSelectedOption}
            options={options}
          />
          <Search filter={filter} setFilter={setFilter} />
        </div>
      </div>
      <div
        className={classNames(
          data.totalRow > 0 ? "overflow-y-auto" : "",
          "md:h-[12.25rem] lg:max-h-[31rem] flex-grow border-gray-400 bg-white rounded-[10px] p-[10px]",
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
            {data.totalRow === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="flex-grow flex-shrink-0 h-[2.8rem] px-2 py-1 bg-white border-b border-gray-400 justify-center gap-2.5 text-stone-800 text-sm font-normal font-roboto"
                >
                  No data found
                </td>
              </tr>
            )}
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={classNames(
                      "flex-grow flex-shrink-0 h-[2.8rem] px-2 py-1 bg-white border-b border-gray-400 justify-start gap-2.5 text-stone-800 text-sm font-normal font-roboto",
                    )}

                  >
                    {flexRender(cell.column.columnDef.cell,cell.getContext())}
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

      </div>
    </div>
  );
}

export default PlayerTable;
