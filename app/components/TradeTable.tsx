import { createColumnHelper, getCoreRowModel, getPaginationRowModel, useReactTable , flexRender } from "@tanstack/react-table";
import PaginationNavigator from "./PaginationNavigator";
import { classNames } from "~/tailwind"
import Search from "./Search";
import { TradeDetail } from "~/models/trade.server";
import CustomDropdownStatus from "./CustomDropdownStatus";
import DetailButton from "./DetailButton";


const columnHelper = createColumnHelper<TradeDetail>();

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

const columns = [
  columnHelper.accessor("itemNo", {
    header: () => "No.",
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor("tradeId", {
    header: () => "หมายเลขการแลกซื้อ",
    cell: (info) => <p className="text-[#0047FF]">{ info.getValue() }</p>
  }),
  columnHelper.accessor("tradedAt", {
    header: () => "วันที่แลกซื้อ",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("customerName", {
    header: () => "ชื่อผู้ใช้",
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
  columnHelper.accessor("totalPointUsed", {
    header: () => "จำนวน Point ที่ใช้แลก",
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor("tradeStatus", {
    header: () => "ตรวจสอบ",
    cell: (info) => <CustomDropdownStatus options={options} defaultOption={info.getValue()} ></CustomDropdownStatus>
  }),
  columnHelper.accessor("shipmentStatus", {
    header: () => "การจัดสั่ง",
    cell: (info) => <CustomDropdownStatus options={options} defaultOption={info.getValue()} ></CustomDropdownStatus>
  }),
  columnHelper.accessor("tradeId", {
    id: "trade_detail",
    header: "รายละเอียด",
    cell: (info) => <DetailButton to={`/trades/${info.getValue()}/detail`}/>
  })
];

interface TradeTableProps {
  data : any , 
  filter : any ,
  setFilter : any
}

function TradeTable ({ data , filter , setFilter } : TradeTableProps ): JSX.Element {
  const table = useReactTable({
    data: data.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  return (
    <div className="w-full h-full flex flex-col">

    {/* header */}

    <div className="flex justify-between items-end mb-2">
      <p>ทั้งหมด {data.totalRow}</p>
      <div className="flex flex-row gap-x-3">
        <Search filter={filter} setFilter={setFilter} />
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

export default TradeTable;
