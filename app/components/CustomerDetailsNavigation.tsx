import { Link } from "@remix-run/react";

import { classNames } from "~/tailwind";

export type CustomerDetailRoute = "order" | "trade"

interface CustomerDetailsNavProps {
  customerId: string
  selectedRoute: CustomerDetailRoute
}

function CustomerDetailsNavigation ({ customerId, selectedRoute }: CustomerDetailsNavProps): JSX.Element {
  return (
    <div className="w-full">
      <div className="flex justify-start items-start h-[55]">
        <div className={classNames(
          selectedRoute === "order" ? "border-[#009fc9]" : "border-transparent",
          "flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 w-[190px] relative gap-2.5 p-2.5 border-t-0 border-r-0 border-b-[4px] border-l-0"
        )}>
          <Link
            to={`/customers/${customerId}/order`}
            className={classNames(
              selectedRoute === "order" ? "text-[#28b7e1]" : "text-[#8cacb8]",
              "flex-grow-0 flex-shrink-0 text-lg font-bold text-left"
            )
          }>
            ประวัติการสั่งซื้อ
          </Link>
        </div>

        <div className={classNames(
          selectedRoute === "trade" ? "border-[#009fc9]" : "border-transparent",
          "flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 w-[190px] relative gap-2.5 p-2.5 border-t-0 border-r-0 border-b-[4px] border-l-0"
        )}>
          <Link
            to={`/customers/${customerId}/trade`}
            className={classNames(
              selectedRoute === "trade" ? "text-[#28b7e1]" : "text-[#8cacb8]",
              "flex-grow-0 flex-shrink-0 text-lg font-bold text-left"
            )
          }>
          การแลกซื้อสินค้า
          </Link>
        </div>
      </div>

      <hr className="border-t border-[#b3b7bA] h-2.5" />
    </div>
  )
}

export default CustomerDetailsNavigation;
