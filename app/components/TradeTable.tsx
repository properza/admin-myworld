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
import EmptyState from "./EmptyState";
import {
  TradeList,
  TradeListWithItemNo,
  TradeResponse,
} from "~/models/tradeList.server";
import PaginationCustom from "./PaginationCustom";
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
import { convertUTC } from "~/utils";
// import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

const timeZone = 'Asia/Bangkok';

const columnHelper = createColumnHelper<TradeTableData["data"][number]>();

const options = [
  {
    title: "รอดำเนินการ",
    shipmentStatus: "pending",
    color: "#414141",
  },
  {
    title: "ตรวจสอบแล้ว",
    shipmentStatus: "complete",
    color: "#1AA127",
  },
  {
    title: "ยกเลิกสิทธิ์",
    shipmentStatus: "cancel",
    color: "#EA5050",
  },
];

const shipmeentOptions = [
  {
    title: "รอดำเนินการ",
    shipmentStatus: "pending",
    color: "#414141",
  },
  {
    title: "จัดส่งสำเร็จ",
    shipmentStatus: "complete",
    color: "#1AA127",
  },
  {
    title: "ยกเลิกจัดส่ง",
    shipmentStatus: "cancel",
    color: "#EA5050",
  },
];

export type TradeTableData = Prettify<
  Omit<TradeResponse, "data"> & {
    data: Omit<TradeListWithItemNo, "order" | "trade">[];
  }
>;

interface TradeTableProps {
  data: TradeTableData;
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  dateValue?: DateType;
  handleValueChange?: (value: DateType) => void;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const EditAprroveStatus: FC<{
  id: string;
  approve_status: string;
  shipment_status: string;
}> = ({ id, approve_status, shipment_status }) => {
  const submit = useSubmit();
  const [info, setInfo] = useState<string>(approve_status);
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const actionData = useActionData();
  useEffect(() => {
    if (actionData?.success) {
      location.reload();
    }
  }, [actionData]);
  const formRef = useRef<HTMLFormElement>(null);
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await submit(e.currentTarget, { replace: true });
    } finally {
    }
  };
  return (
    <Form
      method="post"
      onSubmit={handleFormSubmit}
      className="flex gap-1 items-center"
      ref={formRef}
    >
      <input name="id" value={id} hidden />
      <select
        name="approve_status"
        defaultValue={info}
        onChange={(e) => {
          setInfo(e.target.value);
          formRef.current?.submit();
        }}
        className="border-2 rounded p-1 text-xs"
        style={{
          borderColor: options.find((v) => v.shipmentStatus === info)?.color,
        }}
      >
        {options.map((v, i) => (
          <option key={`${i}_${v.shipmentStatus}`} value={v.shipmentStatus}>
            {v.title}
          </option>
        ))}
      </select>
    </Form>
  );
};

import { parseISO, format, addHours, subHours } from "date-fns";
const timeZoneOffset = 7;

const EditShipmentStatus: FC<{
  id: string;
  approve_status: string;
  shipment_status: string;
}> = ({ id, approve_status, shipment_status }) => {
  const submit = useSubmit();
  const [info, setInfo] = useState<string>(shipment_status);
  const navigate = useNavigate();
  const actionData = useActionData();
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (actionData?.success) {
      location.reload();
    }
  }, [actionData]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      submit(e.currentTarget, { replace: true });
    } finally {
    }
  };
  return (
    <Form
      method="post"
      onSubmit={handleFormSubmit}
      className="flex gap-1 items-center"
      ref={formRef}
    >
      <input name="id" value={id} hidden />
      <select
        name="shipment_status"
        defaultValue={info}
        onChange={(e) => {
          setInfo(e.target.value);
          formRef.current?.submit();
        }}
        className="border-2 rounded p-1 text-xs"
        style={{
          borderColor: shipmeentOptions.find((v) => v.shipmentStatus === info)
            ?.color,
        }}
      >
        {shipmeentOptions.map((v, i) => (
          <option key={`${i}_${v.shipmentStatus}`} value={v.shipmentStatus}>
            {v.title}
          </option>
        ))}
      </select>
    </Form>
  );
};

interface DateType {
  startDate: Date | string;
  endDate: Date | string;
}

function TradeTable({ data, filter, setFilter, setPage }: TradeTableProps): JSX.Element {
  const submit = useSubmit();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  const defaultDate = {
    startDate: format(sevenDaysAgo, "yyyy-MM-dd"),
    endDate: format(today, "yyyy-MM-dd"),
  };
  const [dateValue, setValue] = useState<DateType>(defaultDate);

  function handleValueChange(newValue: DateType) {
    console.log("handleValueChange", newValue);
    setValue(newValue);
  }

  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    setSearchParams(
      (prev) => {
        const updatedSearchParams = new URLSearchParams(prev);
        if (dateValue?.startDate) {
          // start date
          updatedSearchParams.set(
            "startAt",
            convertUTC({ dateValue: dateValue.startDate, isStart: true }),
          );
        } else {
          updatedSearchParams.delete("startAt");
        }
        if (dateValue?.endDate) {
          // end date
          updatedSearchParams.set(
            "endAt",
            convertUTC({ dateValue: dateValue.endDate }),
          );
        } else {
          updatedSearchParams.delete("endAt");
        }

        return updatedSearchParams;
      },
      { preventScrollReset: true },
    );
  }, [dateValue.endDate, dateValue.startDate, setSearchParams]);

  //console.log("1"+dateValue.endDate, dateValue.startDate, 'setSearchParams');

  const columns = useMemo(
    () => [
      columnHelper.accessor("itemNo", {
        header: () => "No.",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("trade_id", {
        header: () => "หมายเลขการแลกซื้อ",
        cell: (info) => <p className="text-[#0047FF]">{info.getValue()}</p>,
      }),
      columnHelper.accessor("created_at", {
        header: () => "วันที่แลกซื้อ",
        
        // cell: (info) => format(parseISO(info.getValue()), "dd MMM yyyy HH:mm"),
        cell: (info) => {
          const date = parseISO(info.getValue());
          const zonedDate = subHours(date, timeZoneOffset);
          return format(zonedDate, 'd MMMM yyyy HH:mm');
        },
        
      }),
      columnHelper.accessor("customer.name", {
        header: () => "ชื่อผู้ใช้",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor(
        (row) => ({
          name: row.merchandise.title1,
          image: row.merchandise.picture,
        }),
        {
          id: "merchandise_info",
          header: () => "ชื่อสินค้า",
          cell: (info) => (
            <div className="flex gap-1 items-center">
              {info.getValue().name ? (
                <img
                  className="w-[27px] h-[27px]"
                  src={info.getValue().image}
                  alt="Random Image"
                />
              ) : (
                <div className="w-[27px] h-[27px] bg-black"></div>
              )}
              <span>{info.getValue().name}</span>
            </div>
          ),
        },
      ),
      columnHelper.accessor("merchandise.point", {
        header: () => "จำนวน Point ที่ใช้แลก",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("approve_status", {
        header: () => "ตรวจสอบ",
        cell: (info) => (
          <EditAprroveStatus
            id={info.row.original.trade_id}
            approve_status={info.getValue()}
            shipment_status={info.row.original.shipment_status}
          />
        ),
      }),
      columnHelper.accessor("shipment_status", {
        header: () => "การจัดสั่ง",
        cell: (info) => (
          <EditShipmentStatus
            id={info.row.original.trade_id}
            approve_status={info.getValue()}
            shipment_status={info.row.original.shipment_status}
          />
        ),
      }),
      columnHelper.accessor("trade_id", {
        id: "trade_detail",
        header: "รายละเอียด",
        cell: (info) => (
          <DetailButton to={`/trades/${info.getValue()}/detail`} />
        ),
      }),
    ],
    [data],
  );
  const table = useReactTable({
    data: data.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 50 } },
  });

  return (
    <div className="w-full h-full flex flex-col">
      {/* header */}

      <div className="flex justify-between items-end mb-2">
        <p>ทั้งหมด {data.totalRow}</p>
        <div className="flex flex-row gap-x-3">
          <Datepicker
            primaryColor={"blue"}
            value={dateValue!}
            onChange={(value) => handleValueChange(value as DateType) }
          />
          <Search filter={filter} setFilter={setFilter} />
        </div>
      </div>

      {/* body */}

      <div
        className={classNames(
          data.totalRow > 0 ? "overflow-y-auto" : "",
          "md:h-[12.25rem] lg:max-h-[50rem] flex-grow border-gray-400 bg-white",
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
        {data.totalRow === 0 ? (
          <div className="flex h-full justify-center items-center ">
            <EmptyState />
          </div>
        ) : null}
      </div>

      {/* footer */}

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
    </div>
  );
}

export default TradeTable;
