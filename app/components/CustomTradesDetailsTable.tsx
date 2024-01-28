import { createColumnHelper, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import React, { useEffect, useRef, useState } from 'react';
import { classNames } from '~/tailwind';
import CustomDropdownStatus from './CustomDropdownStatus';

interface CustomTradesDetailsTableProps {
  TradesInfo : CustomTradesInfo
  TradesItemsList : CustomTradesItems[]
}

interface CustomTradesInfo {
  tradeId : string
  tradedAt : string
}

interface CustomTradesItems {
  itemNo : number
  amount : number
  tradeStatus: string
  shipmentStatus: string
  totalPointUsed: string
  merchandiseName: string, 
  merchandiseImageUrl: string
}

// แก้ enum status ตรงนี้
const options = [{
  title : 'ตรวจสอบแล้ว',
  shipmentStatus : 'approved',
  color : '#1AA127'
},
{
  title : 'รอดำเนินการ',
  shipmentStatus : 'pending',
  color : '#414141'
},
{
  title : 'จัดส่งสำเร็จ',
  shipmentStatus : 'successfully',
  color : '#1AA127'
  
},
{
  title : 'ยกเลิกจัดส่ง',
  shipmentStatus : 'shipping_cancel',
  color : '#EA5050'
  
},
{
  title : 'ยกเลิกสิทธิ์',
  shipmentStatus : 'approve_cancel',
  color : '#EA5050'
},
]

const columnHelper = createColumnHelper<CustomTradesItems>();

const columns = [
  columnHelper.accessor("itemNo", {
    header: () => "No.",
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor((row) => ({ name: row.merchandiseName, image: row.merchandiseImageUrl }), {
    id: "merchandise_info",
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
  columnHelper.accessor("amount", {
    header: () => "จำนวน",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("totalPointUsed", {
    header: () => "จำนวน Point ที่ใช้แลก",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("tradeStatus", {
    header: () => "ตรวจสอบ",
    cell: (info) => <CustomDropdownStatus options={options} defaultOption={info.getValue()} ></CustomDropdownStatus>
  }),
  columnHelper.accessor("shipmentStatus", {
    header: () => "การจัดส่ง",
    cell: (info) => <CustomDropdownStatus options={options} defaultOption={info.getValue()} ></CustomDropdownStatus>
  })
];


const CustomTradesDetailsTable: React.FC<CustomTradesDetailsTableProps> = ({ TradesInfo , TradesItemsList }) => {

  const table = useReactTable({
    data: TradesItemsList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });
  
  return (
    <div className="w-full h-56 flex flex-col bg-white rounded-lg relative pt-4">
      <div className="flex justify-between w-full p-4">
        <div><b>{TradesInfo.tradeId}</b></div>
        <small>วันที่ทำรายการ {TradesInfo.tradedAt}</small>
      </div>

      <div className={classNames( "md:h-[12.25rem] lg:max-h-[31rem] flex-grow border-gray-400 bg-white p-4")}>
        <div className="m-1">รายการแลกซื้อ</div>
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className={classNames(`md:max-w-[${header.getSize()}px]`, "flex-grow flex-shrink-0 h-[2.75rem] px-2.5 py-1 border-t border-b justify-start items-center gap-2.5 text-slate-500 text-base text-left font-light font-roboto")}>
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
                    className={classNames("flex-grow flex-shrink-0 h-[2.8rem] px-2 py-1 bg-white border-b justify-start gap-2.5 text-stone-800 text-sm font-normal font-roboto")}
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
      
   </div>
  );
};

export default CustomTradesDetailsTable;
