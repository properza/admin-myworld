import React, { useState } from "react";
import config from "~/config";
import { getUserData, requireUserId } from "~/services/session.server";
import { constructURL } from "~/utils";

interface TradeUpdateStatusProps {
  id: string;
  approve_status: string;
  accessToken: string;
}

const options = [
  {
    title: "รอดำเนินการ",
    approve_status: "pending",
    color: "#414141",
  },
  {
    title: "ตรวจสอบแล้ว",
    approve_status: "complete",
    color: "#1AA127",
  },
  {
    title: "ยกเลิกสิทธิ์",
    approve_status: "reject",
    color: "#EA5050",
  },
];

const TradeUpdateStatus: React.FC<TradeUpdateStatusProps> = ({
  id,
  approve_status,
  accessToken,
}) => {
  const [selectedStatus, setSelectedStatus] = useState("complete");
  /// dotenv and token
  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const formData = new FormData();
    formData.append("storefront_status", e.target.value);

    try {
      const response = await fetch(
        constructURL(config.api.baseUrl, `/orders/storefront/${id}/status`),
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        },
      );

      if (!response.ok) throw new Error("error has occured");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <input name="id" value={id} hidden />
      <select
        name="approve_status"
        value={selectedStatus}
        onChange={handleChange}
        className="border-2 rounded p-1 text-xs"
        style={{
          borderColor: options.find((v) => v.approve_status === selectedStatus)
            ?.color,
        }}
      >
        {options.map((v, i) => (
          <option
            key={`${i}_${v.approve_status}`}
            value={v.approve_status}
            selected={v.approve_status === selectedStatus}
          >
            <span
              style={{
                color: `${
                  v.approve_status === selectedStatus ? v.color : ""
                } !imporant`,
              }}
            >
              {v.title}
            </span>
          </option>
        ))}
      </select>
    </>
  );
};

export default TradeUpdateStatus;
