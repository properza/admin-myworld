import { classNames } from "~/tailwind";

function ShippingStatusBadge({
  isDelivered,
}: {
  isDelivered: boolean;
}): JSX.Element {
  return (
    <div className="w-[7.5rem] h-9 py-2.5 bg-white border-gray-400 justify-start items-center gap-2.5 inline-flex">
      <div
        className={classNames(
          isDelivered ? "bg-[#cbf4cc]" : "bg-[#eeeeee]",
          "w-full px-1.5 py-1 rounded-full items-center gap-1 flex",
        )}
      >
        <div className="inline-flex justify-start gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            className={classNames(
              isDelivered ? "fill-[#1fd831]" : "fill-[#b3b7ba]",
              "w-4 h-4 relative bi bi-circle-fill",
            )}
          >
            <circle cx="8" cy="8" r="8"></circle>
          </svg>
          <p className="self-center text-black text-xs font-normal font-poppins leading-3">
            {isDelivered ? "จัดส่งสำเร็จ" : "ยังไม่ดำเนินการ"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ShippingStatusBadge;
