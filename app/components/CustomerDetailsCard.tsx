import { Customer } from "~/models/customer.server"
import { ShippingAddress } from "~/models/order.server";

interface CustomerDetailsCardProps {
  customer: Customer
  showCustomerInfo: boolean
}

function CustomerDetailsCard ({ customer, showCustomerInfo }: CustomerDetailsCardProps): JSX.Element {
  return (
    <div className="w-full h-56 flex flex-row bg-white rounded-lg shadow-md relative">
      <div className="flex flex-row p-5 gap-6"> 
        <div className="flex-none left-[10px] top-[21px]">
          <img className="w-24 h-24 rounded-full border border-gray-400 full" src={customer.picture ?? "/images/avatar.svg"} alt="Avatar" draggable="false" />
        </div>

        {showCustomerInfo ? <CustomerInfoView customer={customer} /> : <ShippingInfoView customer={customer} />}
      </div>
    </div>
  );
}

function CustomerInfoView ({ customer }: { customer: Customer }): JSX.Element {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-neutral-700 text-xl font-bold font-roboto capitalize">{customer.name}</p>

      <div className="inline-flex gap-5 items-center justify-start">
        <p className="text-neutral-700 text-sm font-bold font-roboto">LINE ID :</p>
        <p className="text-black text-sm font-normal font-roboto">@{customer.customer_id}</p>
      </div>

      <div className="inline-flex gap-5 items-center justify-start">
        <p className="text-neutral-700 text-sm font-bold font-roboto">Email :</p>
        <p className="text-black text-sm font-normal font-roboto">{customer.email}</p>
      </div>

      <div className="inline-flex gap-5 items-center justify-start">
        <p className="text-neutral-700 text-sm font-bold font-roboto">Tel :</p>
        <p className="text-black text-sm font-normal font-roboto">{customer.phone ?? "-"}</p>
      </div>

      <div className="inline-flex gap-5 items-center justify-start">
        <p className="text-neutral-700 text-sm font-bold font-roboto">Point :</p>
        <div className="flex items-center gap-2.5">
          <img className="w-5 h-5" src="/images/line-point.svg" alt="Point" draggable="false" />
          <p className="text-black text-sm font-bold font-roboto uppercase">{customer.point.toLocaleString()}</p>
        </div>
      </div>

      <div className="inline-flex gap-5 items-center justify-start">
        <p className="text-neutral-700 text-sm font-bold font-roboto">Game Point :</p>
        <div className="flex items-center gap-2.5">
          <img className="w-5 h-5" src="/images/game-point.svg" alt="Point" draggable="false" />
          <p className="text-black text-sm font-bold font-roboto uppercase">{customer.game_point.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}

function ShippingInfoView ({ customer }: { customer: Customer }): JSX.Element {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-neutral-700 text-xl font-bold font-roboto capitalize">{customer.name}</p>

      <div className="inline-flex gap-5 items-center justify-start">
        <p className="text-neutral-700 text-sm font-bold font-roboto">LINE ID :</p>
        <p className="text-black text-sm font-normal font-roboto">@{customer.customer_id}</p>
      </div>

      <div className="inline-flex gap-5 items-center justify-start">
        <p className="text-neutral-700 text-sm font-bold font-roboto">Point :</p>
        <div className="flex items-center gap-2.5">
          <img className="w-5 h-5" src="/images/line-point.svg" alt="Point" draggable="false" />
          <p className="text-black text-sm font-bold font-roboto uppercase">{customer.point.toLocaleString()}</p>
        </div>
      </div>

      <div className="inline-flex gap-5 items-center justify-start">
        <p className="text-neutral-700 text-sm font-bold font-roboto">Game Point :</p>
        <div className="flex items-center gap-2.5">
          <img className="w-5 h-5" src="/images/game-point.svg" alt="Point" draggable="false" />
          <p className="text-black text-sm font-bold font-roboto uppercase">{customer.game_point.toLocaleString()}</p>
        </div>
      </div>

      <p className="text-neutral-700 text-sm font-bold font-roboto">ที่อยู่การจัดส่งสินค้า</p>
      <p className="text-neutral-700 text-sm font-normal font-roboto">ที่อยู่ {parseAddress(customer.order[0]?.shippingAddress)}</p>
    </div>
  );
}

function parseAddress (address: ShippingAddress | undefined): string {
  if (!address) {
    return "-";
  }

  const getAddressPartWithLabel = (address: ShippingAddress, field: keyof ShippingAddress, label: string): string => {
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

export default CustomerDetailsCard;
