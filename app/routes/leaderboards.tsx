import React, { useState, useEffect, useMemo } from "react";
import axios from "axios"; // Import axios
import { Leaderboard } from "~/models/leaderboard.server"; // Ensure correct path
import { useLocation } from "@remix-run/react";
import Layout from "~/components/Layout";
import { classNames } from "~/tailwind";
import { useReactTable, createColumnHelper, flexRender, getCoreRowModel } from "@tanstack/react-table";
import UsernameSection from "~/components/UserNameSection";

export default function Leaderboards() {
    const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([]);
    const location = useLocation();
    const columnHelper = createColumnHelper<Leaderboard>();
    const baseUrl = "https://games.myworld-store.com/api";

    useEffect(() => {
        const getLeaderboardData = async () => {
            try {
                const response = await axios.get(`${baseUrl}/mymap/leaderboardAdmin`);
                console.log("Leaderboard Data:", response.data);
                setLeaderboard(response.data);
            } catch (error) {
                console.error("Error fetching leaderboard data:", error);
            }
        };

        getLeaderboardData();
    }, []);

    const columns = useMemo(() => [
        columnHelper.accessor("id", {
            header: () => "No.",
            cell: (info) => info.row.index + 1,
        }),
        columnHelper.accessor((row) => ({ name: row.customer.name, image: row.customer.picture }), {
            header: "ชื่อผู้ใช้",
            cell: (info) => (
                <UsernameSection
                    name={info.getValue().name}
                    imageUrl={info.getValue().image}
                />
            ),
            size: 44,
        }),
        columnHelper.accessor("total", {
            header: "จำนวนร้าน Check-in",
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("diff_seconds", {
            header: "จำนวนคอยน์",
            cell: (info) => info.getValue(),
        }),
    ], [columnHelper]);

    const table = useReactTable({
        data: leaderboard,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <Layout
            title="Top 100"
            pathname={location.pathname}
            isSubRoute={false}
            returnRoute=""
        >
            <div className="w-full h-full flex flex-col ">
                <div className="flex justify-between items-end mb-4">
                    <p>ผลลัพท์ ({leaderboard.length})</p>
                </div>
                <div
                    className={classNames(
                        leaderboard.length > 0 ? "overflow-y-auto" : "",
                        "md:h-[50vh] lg:max-h-[40rem] flex-grow border-gray-400 bg-white",
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
                </div>
            </div>
        </Layout>
    );
}
