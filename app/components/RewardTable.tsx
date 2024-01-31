import { createColumnHelper, getCoreRowModel, getPaginationRowModel, useReactTable , flexRender } from "@tanstack/react-table";
import PaginationNavigator from "./PaginationNavigator";
import { classNames } from "~/tailwind"
import { useState } from "react";
import CustomDropdownReward from "./CustomDropdownReward";
import { RewardDetail } from "~/models/reward.server";


const columnHelper = createColumnHelper<RewardDetail>();

// แก้ enum status ตรงนี้
const options = [{
  title : 'เผยแพร่',
  shareStatus : true,
  color : '#1AA127'
},
{
  title : 'ไม่เผยแพร่',
  shareStatus : false,
  color : '#414141'
}
]


const columns = [
  columnHelper.accessor("itemNo", {
    header: () => "No.",
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor((row) => ({ name: row.productName, image: row.productImage }), {
    id: "product_info",
    header: () => "ชื่อสินค้า",
    cell: (info) => <div className="flex gap-1 items-center">
                      { info.getValue().name ? ( 
                        <img className="w-[27px] h-[27px]" src={info.getValue().image} alt="Random Image" />
                      ) : (
                        <div className="w-[27px] h-[27px] bg-black"></div>
                      )
                      }
                      <span>{info.getValue().name}</span>
                    </div>
  }),
  columnHelper.accessor("productDetail", {
    header: () => "รายละเอียดสินค้า",
    cell: (info) => <p className="text-[#0047FF]">{ info.getValue() }</p>
  }),
  columnHelper.accessor("priceThb", {
    header: () => "ราคา (บาท)",
    cell: (info) => info.getValue().toFixed(2),
  }),
  columnHelper.accessor("pricePoint", {
    header: () => "จำนวน Point ที่ใช้แลก",
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor("remaining", {
    header: () => "คงเหลือ",
    cell: (info) => info.getValue()
  }),

  columnHelper.accessor("shareStatus", {
    header: () => "สถานะการเผยแพร่",
    cell: (info) => <CustomDropdownReward options={options} defaultOption={info.getValue()} ></CustomDropdownReward>
  }),
  columnHelper.accessor("rewardId", {
    header: () => "จัดการ",
    cell: (info) => <div className="flex space-x-1">
          <div className="cursor-pointer">
            <img src="/images/pencil-alt.svg" alt="More options"  draggable="false" />
          </div>
          <div className="cursor-pointer"> 
            <img src="/images/trash.svg" alt="More options"  draggable="false" />
          </div>
    </div>
  })

];

interface RewardTableProps {
  data : any 
}

function RewardTable ({ data } : RewardTableProps ): JSX.Element {
  const table = useReactTable({
    data: data.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  console.log(data.data)


  return (
    <div className="w-full h-full flex flex-col">

    {/* header */}

    <div className="flex justify-between items-end mb-2">
      <p>ทั้งหมด {data.totalRow}</p>
      <div className="flex flex-row gap-x-3">
        <button className="bg-[#28B7E1] h-[40px] w-[170px] border-none rounded-md text-white">Create</button>
      </div>
    </div>

    {/* body */}


    <div className={classNames(data.totalRow > 0 ? "overflow-y-auto" : "", "md:h-[12.25rem] lg:max-h-[31rem] flex-grow border-gray-400 bg-white")}>
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className={classNames(`md:max-w-[${header.getSize()}px]`, "flex-grow flex-shrink-0 h-[2.75rem] px-2.5 py-1 bg-gray-200 border-t border-b border-gray-400 justify-start items-center gap-2.5 text-slate-500 text-base text-left font-light font-roboto")}>
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
                    className={classNames("flex-grow flex-shrink-0 h-[2.8rem] px-2 py-1 bg-white border-b border-gray-400 justify-start gap-2.5 text-stone-800 text-sm font-normal font-roboto")}
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


    {/* footer */}

    <div className="flex justify-between items-center gap-2 mt-2 mb-16">
      <span className="flex items-center gap-1">
        <div>Page</div>
        <strong>
          {table.getState().pagination.pageIndex + 1} of {" "}
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
  )
}

export default RewardTable;
