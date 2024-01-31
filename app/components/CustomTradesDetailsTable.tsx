import React from 'react';
import { TradesDetail } from '~/models/trade.server';
import { classNames } from '~/tailwind';
import CustomDropdownStatus from './CustomDropdownStatus';

interface CustomTradesDetailsTableProps {
  TradeDetail : TradesDetail
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


const CustomTradesDetailsTable: React.FC<CustomTradesDetailsTableProps> = ({ TradeDetail }) => {

  
  
  return (
    <div className="w-full h-56 flex flex-col bg-white rounded-lg relative pt-4">
      <div className="flex justify-between w-full p-4">
        <div><b>{TradeDetail.trade_id}</b></div>
        <small>วันที่ทำรายการ {TradeDetail.created_at}</small>
      </div>

      <div className={classNames( "md:h-[12.25rem] lg:max-h-[31rem] flex-grow border-gray-400 bg-white p-4")}>
        <div className="m-1">รายการแลกซื้อ</div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="flex-grow flex-shrink-0 h-[2.75rem] px-2.5 py-1 bg-gray-200 border-t border-b border-gray-400 justify-start items-center gap-2.5 text-slate-500 text-base text-left font-light font-roboto">No.</th>
              <th className="flex-grow flex-shrink-0 h-[2.75rem] px-2.5 py-1 bg-gray-200 border-t border-b border-gray-400 justify-start items-center gap-2.5 text-slate-500 text-base text-left font-light font-roboto">ชื่อสินค้า</th>
              <th className="flex-grow flex-shrink-0 h-[2.75rem] px-2.5 py-1 bg-gray-200 border-t border-b border-gray-400 justify-start items-center gap-2.5 text-slate-500 text-base text-left font-light font-roboto">จำนวน</th>
              <th className="flex-grow flex-shrink-0 h-[2.75rem] px-2.5 py-1 bg-gray-200 border-t border-b border-gray-400 justify-start items-center gap-2.5 text-slate-500 text-base text-left font-light font-roboto">จำนวน point ที่ใช้แลก</th>
              <th className="flex-grow flex-shrink-0 h-[2.75rem] px-2.5 py-1 bg-gray-200 border-t border-b border-gray-400 justify-start items-center gap-2.5 text-slate-500 text-base text-left font-light font-roboto">ตรวจสอบ</th>
              <th className="flex-grow flex-shrink-0 h-[2.75rem] px-2.5 py-1 bg-gray-200 border-t border-b border-gray-400 justify-start items-center gap-2.5 text-slate-500 text-base text-left font-light font-roboto">การจัดส่ง</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="flex-grow flex-shrink-0 h-[2.8rem] px-2 py-1 bg-white border-b border-gray-400 justify-start gap-2.5 text-stone-800 text-sm font-normal font-roboto">1</td>
              <td className="flex-grow flex-shrink-0 h-[2.8rem] px-2 py-1 bg-white border-b border-gray-400 justify-start gap-2.5 text-stone-800 text-sm font-normal font-roboto"> 
                    <div className="flex gap-1 items-center">
                      { TradeDetail.merchandise.name ? ( 
                        <img className="w-[27px] h-[27px]" src={TradeDetail.merchandise.picture} alt="Random Image" />
                      ) : (
                        <div className="w-[27px] h-[27px] bg-black"></div>
                      )
                      }
                      <span>{TradeDetail.merchandise.name}</span>
                    </div>
              </td>
              <td className="flex-grow flex-shrink-0 h-[2.8rem] px-2 py-1 bg-white border-b border-gray-400 justify-start gap-2.5 text-stone-800 text-sm font-normal font-roboto">1</td>
              <td className="flex-grow flex-shrink-0 h-[2.8rem] px-2 py-1 bg-white border-b border-gray-400 justify-start gap-2.5 text-stone-800 text-sm font-normal font-roboto">{ TradeDetail.merchandise.point.toFixed(2) }</td>
              <td className="flex-grow flex-shrink-0 h-[2.8rem] px-2 py-1 bg-white border-b border-gray-400 justify-start gap-2.5 text-stone-800 text-sm font-normal font-roboto">
                <CustomDropdownStatus options={options} defaultOption={TradeDetail.approve_status} ></CustomDropdownStatus>
              </td>
              <td className="flex-grow flex-shrink-0 h-[2.8rem] px-2 py-1 bg-white border-b border-gray-400 justify-start gap-2.5 text-stone-800 text-sm font-normal font-roboto">
                <CustomDropdownStatus options={options} defaultOption={TradeDetail.shipment_status} ></CustomDropdownStatus>
              </td>
            </tr>
          </tbody>
        </table>
        {/* Empty State Here */}
      </div>
      
   </div>
  );
};

export default CustomTradesDetailsTable;
