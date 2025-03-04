import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import { FC, useState, useRef, useEffect, useMemo } from "react";
import {
    Form,
    useActionData,
    useNavigate,
    useRevalidator,
    useSearchParams,
    useSubmit,
} from "@remix-run/react";
import EmptyState from "./EmptyState";
import { convertUTC } from "~/utils";
import PaginationNavigator from "./PaginationNavigator";
import { useLoaderData, useLocation } from "@remix-run/react";
import Datepicker from "react-tailwindcss-datepicker";
import { Prettify } from "~/utils.type";
import { CustomersDataWithItemNo, CustomersResponse } from "~/models/customerEvent.server";
import DropdownSelect from "./DropdownSelect";
import Search from "./Search";
import { classNames } from "~/tailwind";
import UsernameSection from "./UserNameSection";
import { parseISO, format, subHours } from "date-fns";

import axios from "axios";
import { getUserData, requireUserId } from "~/services/session.server";
import { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import CheckinUpdateStatus from './CheckinUpdateStatus.jsx';


const timeZoneOffset = 7;

interface CustomerCheckinTableProps {
    data: CustomersResponse;
    filter: string;
    setFilter: React.Dispatch<React.SetStateAction<string>>;
    accessToken: string;
}

const columnHelper = createColumnHelper<CustomersDataWithItemNo>(); // Use correct type

export type CustomersProps = Prettify<
    Omit<CustomersResponse, "data"> & { data: CustomersDataWithItemNo[] }
>;

interface DateType {
    startDate: Date | string;
    endDate: Date | string;
}

function CustomerCheckinTable({
    data,
    filter,
    setFilter,
    accessToken
}: CustomerCheckinTableProps): JSX.Element {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
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

    const columns = useMemo(
        () => [
            columnHelper.accessor("itemNo", {
                header: () => "No.",
                cell: (info) => info.getValue(),
            }),
            columnHelper.accessor("restaurant_name", {
                header: () => "ชื่อร้าน",
                cell: (info) => info.getValue() ?? "-",
            }),
            columnHelper.accessor("branch_name", {
                header: () => "พิกัส / โซน",
                cell: (info) => info.getValue() ?? "-",
            }),
            columnHelper.accessor("created_at", {
                header: () => "วัน-เวลา Check-in",
                cell: (info) => {
                    const date = parseISO(info.getValue());
                    const zonedDate = subHours(date, timeZoneOffset);
                    return format(zonedDate, 'dd MMMM yyyy เวลา HH:mm');
                },
            }),
            columnHelper.accessor((row) => ({ name: row.customer_name, image: row.customer_picture }), {
                header: "ชื่อผู้ใช้",
                cell: (info) => (
                    <UsernameSection
                        name={info.getValue().name}
                        imageUrl={info.getValue().image}
                    />
                ),
                size: 44,
            }),
            columnHelper.accessor("image_url", {
                header: () => "รายละเอียด",
                cell: (info) => {
                    const imgSrc = info.getValue() ?? "-";
                    return imgSrc !== "-" ? (
                        <img
                            src={imgSrc}
                            alt="Customer"
                            width={50}
                            height={50}
                            className="cursor-pointer"
                            onClick={() => {
                                setSelectedImage(imgSrc); // Set the selected image source
                                setIsModalOpen(true); // Open the modal
                            }}
                        />
                    ) : (
                        <span>-</span>
                    );
                },
            }),
            columnHelper.accessor("status", {
                header: () => "ตรวจสอบ",
                cell: (info) => {
                    return (
                        <CheckinUpdateStatus
                            id={info.row.original.id}
                            approve_status={info.getValue()}
                            accessToken={accessToken}
                        />
                    )
                },
            }),
        ],
        [data],
    )
    // Map the `data.data` to include `itemNo`
    const mappedData: CustomersDataWithItemNo[] = data.data.map((customer, index) => ({
        ...customer,
        itemNo: (data.currentPage - 1) * data.perPage + index + 1, // Calculate `itemNo`
    }));

    const table = useReactTable({
        data: data.data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="w-full h-full flex flex-col ">
            <div className="flex justify-between items-end mb-4">
                <p>ผลลัพท์ ({data.totalRow})</p>
                <div className="flex flex-row gap-x-3">
                    <Datepicker
                        primaryColor={"blue"}
                        value={dateValue!}
                        onChange={(value) => handleValueChange(value as DateType)}
                    />
                    <Search filter={filter} setFilter={setFilter} />
                </div>
            </div>
            {/* Your table rendering */}
            <div
                className={classNames(
                    data.totalRow > 0 ? "overflow-y-auto" : "",
                    "md:h-[12.25rem] lg:max-h-[40rem] flex-grow border-gray-400 bg-white",
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
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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

            {/* Pagination */}
            <div className="flex justify-between items-center gap-2 mt-2 mb-16">
                <span className="flex items-center gap-1">
                    <div>Page</div>
                    <strong>{table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</strong>
                </span>

                <PaginationNavigator
                    currentPage={table.getState().pagination.pageIndex + 1}
                    totalPage={table.getPageCount()}
                    setPageIndex={table.setPageIndex}
                />
            </div>
            {isModalOpen && selectedImage && (
                <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="relative bg-white p-4 rounded-lg">
                        <img src={selectedImage} alt="Expanded View" className="max-w-full max-h-screen object-contain" />
                    </div>
                </div>
            )}
        </div>
    );
}

export default CustomerCheckinTable;
