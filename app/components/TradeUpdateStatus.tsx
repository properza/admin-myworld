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
    approve_status: "none",
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
        constructURL(
          "https://games.myworld-store.com/api",
          `/orders/storefront/${id}/status`,
        ),
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
      <input name="id" value={id} hidden readOnly />
      <select
        name="approve_status"
        value={selectedStatus} // This controls which option is selected
        onChange={handleChange}
        className="border-2 rounded p-1 text-xs"
        style={{
          borderColor: options.find((v) => v.approve_status === selectedStatus)
            ?.color,
        }}
      >
        {options.map((v, i) => (
          <option key={`${i}_${v.approve_status}`} value={v.approve_status}>
            {v.title}
          </option>
        ))}
      </select>
    </>
  );
};

export default TradeUpdateStatus;
