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
    approve_status: "confirm",
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
  const [selectedStatus, setSelectedStatus] = useState(approve_status);
  /// dotenv and token
  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const requestBody = JSON.stringify({
      storefront_status: e.target.value,
    });

    console.log(accessToken)
    try {
      const response = await fetch(
        constructURL(
          "https://games.myworld-store.com/api-dev",
          `/orders/storefront/${id}/status`,
        ),
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: requestBody,
        },
      );

      if (response.ok) {
        
        window.location.href = "orders?tab=Trade";
      } else {
        throw new Error("Error has occurred");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <input name="id" value={id} hidden readOnly />
      {approve_status === "pending" ? (
        <select
          name="approve_status"
          value={selectedStatus} // This controls which option is selected
          onChange={handleChange}
          className="border-2 rounded p-1 text-xs"
          style={{
            borderColor: options.find(
              (v) => v.approve_status === selectedStatus,
            )?.color,
          }}
        >
          {options.map((v, i) => (
            <option key={`${i}_${v.approve_status}`} value={v.approve_status}>
              {v.title}
            </option>
          ))}
        </select>
      ) : (
        <p
          className="text-xs"
          style={{
            color: options.find((v) => v.approve_status === approve_status)
              ?.color,
          }}
        >
          {options.find((v) => v.approve_status === approve_status)?.title}
        </p>
      )}
    </>
  );
};

export default TradeUpdateStatus;
