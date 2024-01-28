import { createColumnHelper, getCoreRowModel, getPaginationRowModel, useReactTable , flexRender } from "@tanstack/react-table";
import { classNames } from "~/tailwind"
import CustomDropdownStatus from "./CustomDropdownStatus";
import { NotificationDetail } from "~/models/notification.server";


const columnHelper = createColumnHelper<NotificationDetail>();

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
  columnHelper.accessor("notificationId", {
    header: () => "หมายเลขการแลกซื้อ",
    cell: (info) => <p className="text-[#0047FF]">{ info.getValue() }</p>
  }),
  columnHelper.accessor("notificationAt", {
    header: () => "วันที่แลกซื้อ",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => ({ name: row.name, image: row.imgUrl }), {
    id: "merchandise_info",
    header: () => "ชื่อสินค้า",
    cell: (info) => <div className="flex gap-1 items-center">
                      { info.getValue().name ? ( 
                        <img className="w-[27px] h-[27px] rounded-full" src={info.getValue().image} alt="Random Image" />
                      ) : (
                        <div className="w-[27px] h-[27px] bg-black rounded-full"></div>
                      )
                      }
                      <span>{info.getValue().name}</span>
                    </div>
  }),
  columnHelper.accessor("totalPoint", {
    header: () => "จำนวน Point ที่ใช้แลก",
    cell: (info) => `${formatNumberWithCommas(info.getValue())} Coins`
  }),
  columnHelper.accessor("status", {
    header: () => "ตรวจสอบ",
    cell: (info) => <button className="w-[110px] h-[40px] text-[#fff] bg-[#8F8F8F] border border-[#8F8F8F] rounded-[20px]">รอจัดส่ง</button>
  }),
  columnHelper.accessor("notificationId", {
    id: "trade_detail",
    header: "รายละเอียด",
    cell: (info) => <button className="w-[110px] h-[40px] text-[#28B7E1] border border-[#28B7E1] rounded-[20px]">ดูรายละเอียด</button>
  })
];

interface NotificationTableProps {
  data : NotificationDetail[]
}

function formatNumberWithCommas(number : number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function NotificationTable ({ data } : NotificationTableProps ): JSX.Element {
  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  return (
    <div className="w-full h-full flex flex-col">

    {/* body */}

    <div className={classNames("lg:max-h-[31rem] flex-grow border-gray-400")}>
        <div className="w-full mb-8">
            {table.getRowModel().rows.map((row) => (
                <div 
                key={row.id}
                className="flex bg-white p-2 border rounded-xl text-sm font-normal font-roboto"
                >
                    {row.getVisibleCells().map((cell , cellIndex , array) => (
                    <div  
                        key={cell.id} 
                        className={`${cellIndex === 0 ? 'flex-none w-[5%]' : cellIndex === array.length - 2 || cellIndex === array.length - 1 ? 'flex-none w-[12%] mx-2' : 'flex-1' } flex items-center`}
                    > 
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                    ))}
                </div>
            ))}

        </div>

      </div>

  </div>
  )
}

export default NotificationTable;
