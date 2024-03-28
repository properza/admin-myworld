import React, { FC, useEffect, useRef, useState } from "react";
import { TradesDetail } from "~/models/trade.server";
import { classNames } from "~/tailwind";
import CustomDropdownStatus from "./CustomDropdownStatus";
import {
  Form,
  useActionData,
  useNavigate,
  useRevalidator,
  useSubmit,
} from "@remix-run/react";

interface CustomTradesDetailsTableProps {
  TradeDetail: TradesDetail;
}

// แก้ enum status ตรงนี้

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

const CustomTradesDetailsTable: React.FC<CustomTradesDetailsTableProps> = ({
  TradeDetail,
}) => {
  return (
    <div className="w-full h-56 flex flex-col bg-white rounded-lg relative pt-4">
      <div className="flex justify-between w-full p-4">
        <div>
          <b>{TradeDetail.trade_id}</b>
        </div>
        <small>วันที่ทำรายการ {TradeDetail.created_at}</small>
      </div>

      <div
        className={classNames(
          "md:h-[12.25rem] lg:max-h-[31rem] flex-grow border-gray-400 bg-white p-4",
        )}
      >
        <div className="m-1">รายการแลกซื้อ</div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="flex-grow flex-shrink-0 h-[2.75rem] px-2.5 py-1 bg-gray-200 border-t border-b border-gray-400 justify-start items-center gap-2.5 text-slate-500 text-base text-left font-light font-roboto">
                No.
              </th>
              <th className="flex-grow flex-shrink-0 h-[2.75rem] px-2.5 py-1 bg-gray-200 border-t border-b border-gray-400 justify-start items-center gap-2.5 text-slate-500 text-base text-left font-light font-roboto">
                ชื่อสินค้า
              </th>
              <th className="flex-grow flex-shrink-0 h-[2.75rem] px-2.5 py-1 bg-gray-200 border-t border-b border-gray-400 justify-start items-center gap-2.5 text-slate-500 text-base text-left font-light font-roboto">
                จำนวน
              </th>
              <th className="flex-grow flex-shrink-0 h-[2.75rem] px-2.5 py-1 bg-gray-200 border-t border-b border-gray-400 justify-start items-center gap-2.5 text-slate-500 text-base text-left font-light font-roboto">
                จำนวน point ที่ใช้แลก
              </th>
              <th className="flex-grow flex-shrink-0 h-[2.75rem] px-2.5 py-1 bg-gray-200 border-t border-b border-gray-400 justify-start items-center gap-2.5 text-slate-500 text-base text-left font-light font-roboto">
                ตรวจสอบ
              </th>
              <th className="flex-grow flex-shrink-0 h-[2.75rem] px-2.5 py-1 bg-gray-200 border-t border-b border-gray-400 justify-start items-center gap-2.5 text-slate-500 text-base text-left font-light font-roboto">
                การจัดส่ง
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="flex-grow flex-shrink-0 h-[2.8rem] px-2 py-1 bg-white border-b border-gray-400 justify-start gap-2.5 text-stone-800 text-sm font-normal font-roboto">
                1
              </td>
              <td className="flex-grow flex-shrink-0 h-[2.8rem] px-2 py-1 bg-white border-b border-gray-400 justify-start gap-2.5 text-stone-800 text-sm font-normal font-roboto">
                <div className="flex gap-1 items-center">
                  {TradeDetail.merchandise.name ? (
                    <img
                      className="w-[27px] h-[27px]"
                      src={TradeDetail.merchandise.picture}
                      alt="Random Image"
                    />
                  ) : (
                    <div className="w-[27px] h-[27px] bg-black"></div>
                  )}
                  <span>{TradeDetail.merchandise.name}</span>
                </div>
              </td>
              <td className="flex-grow flex-shrink-0 h-[2.8rem] px-2 py-1 bg-white border-b border-gray-400 justify-start gap-2.5 text-stone-800 text-sm font-normal font-roboto">
                1
              </td>
              <td className="flex-grow flex-shrink-0 h-[2.8rem] px-2 py-1 bg-white border-b border-gray-400 justify-start gap-2.5 text-stone-800 text-sm font-normal font-roboto">
                {TradeDetail.merchandise.point.toFixed(2)}
              </td>
              <td className="flex-grow flex-shrink-0 h-[2.8rem] px-2 py-1 bg-white border-b border-gray-400 justify-start gap-2.5 text-stone-800 text-sm font-normal font-roboto">
                <EditAprroveStatus
                  id={TradeDetail.trade_id}
                  approve_status={TradeDetail.approve_status}
                  shipment_status={TradeDetail.shipment_status}
                />
              </td>
              <td className="flex-grow flex-shrink-0 h-[2.8rem] px-2 py-1 bg-white border-b border-gray-400 justify-start gap-2.5 text-stone-800 text-sm font-normal font-roboto">
                <EditShipmentStatus
                  id={TradeDetail.trade_id}
                  approve_status={TradeDetail.approve_status}
                  shipment_status={TradeDetail.shipment_status}
                />
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
