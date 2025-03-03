import React, { useState } from "react";
import config from "~/config";
import { getUserData, requireUserId } from "~/services/session.server";
import { constructURL } from "~/utils";

interface SetboxesUpdateStatusProps {
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
    approve_status: "approved",
    color: "#1AA127",
  },
  {
    title: "ไม่อนุมัติ",
    approve_status: "rejected",
    color: "#EA5050",
  },
];

const SetboxesUpdateStatus: React.FC<SetboxesUpdateStatusProps> = ({
  id,
  approve_status,
  accessToken,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(approve_status);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus); // Update state with the new status

    console.log("Selected status:", newStatus); // Log the selected status

    const requestBody = JSON.stringify({
        approve_status: newStatus,
    });

    try {
      const response = await fetch(
        constructURL(
          `https://games.myworld-store.com/api`,
          `/mymap/approveRedeemCouponAdmin/${id}`,
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
        window.location.href = "/setboxes";
      } else {
        throw new Error("Error has occurred");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const selectedOption = options.find((v) => v.approve_status === selectedStatus);
  const statusColor = selectedOption?.color;

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
            borderColor: statusColor
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
          className={`text-xs border-2 rounded w-full p-2`}
          style={{
            borderColor: statusColor,
            color: statusColor
          }}
        >
          {options.find((v) => v.approve_status === approve_status)?.title}
        </p>
      )}
    </>
  );
};

export default SetboxesUpdateStatus;
