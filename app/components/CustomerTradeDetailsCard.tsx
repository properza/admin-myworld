import { ShippingAddress } from "~/models/order.server";
import { TradesDetail } from "~/models/trade.server";

interface CustomerDetailsCardProps {
  tradeDetail: TradesDetail;
  showShippingIinfo?: boolean;
}

function CustomerTradeDetailsCard({
  tradeDetail,
  showShippingIinfo,
}: CustomerDetailsCardProps): JSX.Element {
  return (
    <div className="flex space-x-2">
      <div className="w-full h-60 flex flex-row bg-white rounded-lg shadow-md relative">
        <div className="flex flex-row p-5 gap-6">
          <div className="flex-none left-[10px] top-[21px]">
            <img
              className="w-24 h-24 rounded-full border border-gray-400 full"
              src={tradeDetail.customer.picture ?? "/images/avatar.svg"}
              alt="Avatar"
              draggable="false"
            />
          </div>

          <CustomerInfoView tradeDetail={tradeDetail} />
        </div>
      </div>

      {showShippingIinfo ? (
        <CustomerShippingInfo tradeDetail={tradeDetail} />
      ) : null}
    </div>
  );
}

function CustomerShippingInfo({
  tradeDetail,
}: {
  tradeDetail: TradesDetail;
}): JSX.Element {
  return (
    <div className="min-w-[300px] max-w-[320px] h-60 bg-white rounded-lg shadow-md relative p-5">
      <p>
        <b>ที่อยู่จัดส่ง</b>
      </p>
      <div className="text-sm space-y-2 my-2 text-[#7A7A7A]">
        <div>
          <span>ชื่อผู้รับ:</span>{" "}
          <span>{tradeDetail.customer.name || "-"}</span>
        </div>
        <div>
          <span>ที่อยู่:</span>{" "}
          <span>
            {tradeDetail.address || "-"} {tradeDetail.sub_district || "-"}{" "}
            {tradeDetail.district || "-"} {tradeDetail.province || "-"}{" "}
            {tradeDetail.postcode || "-"}
          </span>
        </div>
        <div>

          <span>เบอร์โทร:</span>{" "}
          <span>{tradeDetail.phone || "-"}</span>

        </div>
        <div>
          <span>อีเมล:</span> <span>{tradeDetail.customer.email || "-"}</span>
        </div>

        <div>
          <span>รายละเอียด:</span> <span>{tradeDetail.note || "-"}</span>
        </div>

      </div>
    </div>
  );
}

function CustomerInfoView({
  tradeDetail,
}: {
  tradeDetail: TradesDetail;
}): JSX.Element {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-neutral-700 text-xl font-bold font-roboto capitalize">
        {tradeDetail.customer.name}
      </p>

      <div className="inline-flex gap-5 items-center justify-start">
        <p className="text-neutral-700 text-sm font-bold font-roboto">
          LINE ID :
        </p>
        <p className="text-black text-sm font-normal font-roboto">
          @{tradeDetail.customer.customer_id}
        </p>
      </div>

      <div className="inline-flex gap-5 items-center justify-start">
        <p className="text-neutral-700 text-sm font-bold font-roboto">
          Email :
        </p>
        <p className="text-black text-sm font-normal font-roboto">
          {tradeDetail.customer.email}
        </p>
      </div>

      <div className="inline-flex gap-5 items-center justify-start">
        <p className="text-neutral-700 text-sm font-bold font-roboto">Tel :</p>
        <p className="text-black text-sm font-normal font-roboto">
          {tradeDetail.customer.phone ?? "-"}
        </p>
      </div>

      <div className="inline-flex gap-5 items-center justify-start">
        <p className="text-neutral-700 text-sm font-bold font-roboto">
          Point :
        </p>
        <div className="flex items-center gap-2.5">
          <img
            className="w-5 h-5"
            src="/images/line-point.svg"
            alt="Point"
            draggable="false"
          />
          <p className="text-black text-sm font-bold font-roboto uppercase">
            {tradeDetail.point.toLocaleString()}
          </p>
        </div>
      </div>

      {/* <div className="inline-flex gap-5 items-center justify-start">
        <p className="text-neutral-700 text-sm font-bold font-roboto">Game Point :</p>
        <div className="flex items-center gap-2.5">
          <img className="w-5 h-5" src="/images/game-point.svg" alt="Point" draggable="false" />
          <p className="text-black text-sm font-bold font-roboto uppercase">{tradeDetail.game_point.toLocaleString()}</p>
        </div>
      </div> */}
    </div>
  );
}

function parseAddress(address: ShippingAddress | undefined): string {
  if (!address) {
    return "-";
  }

  const getAddressPartWithLabel = (
    address: ShippingAddress,
    field: keyof ShippingAddress,
    label: string,
  ): string => {
    const value = address[field];

    return value ? label + value : "";
  };

  const formattedAddressParts = [
    getAddressPartWithLabel(address, "address", ""),
    getAddressPartWithLabel(address, "subDistrict", "ตำบล"),
    getAddressPartWithLabel(address, "district", "อำเภอ"),
    getAddressPartWithLabel(address, "province", "จังหวัด"),
    getAddressPartWithLabel(address, "postalCode", "รหัสไปรษณีย์ "),
  ];

  return formattedAddressParts.join(" ").trim();
}

export default CustomerTradeDetailsCard;
