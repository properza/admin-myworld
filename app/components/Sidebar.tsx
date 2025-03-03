import { Link } from "@remix-run/react";

import { classNames } from "~/tailwind";

const generalNavigation: Navigation[] = [
  {
    name: "Customer",
    text: "สมาชิก",
    icon: "/images/users.svg",
    href: "/customers",
  },
  {
    name: "Order",
    text: "รายการสั่งซื้อ",
    icon: "/images/product.svg",
    href: "/orders?tab=Order",
  },
  {
    name: "Trade",
    text: "แลกซื้อสินค้า",
    icon: "/images/switch-horizontal.svg",
    href: "/trades",
  },
  {
    name: "Product",
    text: "จัดการสินค้า",
    icon: "/images/products.svg",
    href: "/product",
  },
  {
    name: "Stock",
    text: "สต็อกหน้าร้าน",
    icon: "/images/store.svg",
    href: "/stock",
  },
  {
    name: "Reward",
    text: "Product Reward",
    icon: "/images/products.svg",
    href: "/reward",
  },
  {
    name: "Admin",
    text: "Admin",
    icon: "/images/user-circle.svg",
    href: "/admins",
  },
];

const eventNavigation: Navigation[] = [
  {
    name: "Checkinuser",
    text: "ข้อมูลการ Check-in",
    icon: "/images/map-pin.svg",
    href: "/checkinusers",
  },
  {
    name: "Set Box",
    text: "การแลก Set Box",
    icon: "/images/ph_storefront-light.svg",
    href: "/SetBoxsettings",
  },
  {
    name: "Top 100",
    text: "Top 100",
    icon: "/images/users.svg",
    href: "/Top-100",
  },
];

const gameNavigation: Navigation[] = [
  {
    name: "Player",
    text: "ผู้เล่น",
    icon: "/images/circum_medal.svg",
    href: "/players",
  },
  {
    name: "Setting",
    text: "ตั้งค่าเกมส์",
    icon: "/images/game-controller.svg",
    href: "/settings",
  },
];

interface Navigation {
  name: string;
  text: string;
  href: string;
  icon: string;
}

interface SidebarProps {
  pathname: string;
  openModal: () => void;
}

export default function Sidebar({
  pathname,
  openModal,
}: SidebarProps): JSX.Element {
  return (
    <div className="flex flex-col w-64 bg-white text-white shadow-md z-10">
      <div className="flex flex-col items-center justify-center h-32 mt-8 mb-8">
        <img
          src="/images/brand-logo.svg"
          alt="My Beer Logo"
          className="w-16 h-16 mb-2"
          draggable="false"
        />

        <div className="mt-2 text-center">
          <span className="text-xl font-kanit font-medium block text-blackrose">
            My World
          </span>
          <span className="text-xl font-kanit font-medium block text-blackrose">
            Back Office
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-auto h-[100vh]">
        <ul >
          <li className="mx-5 my-2.5 p-2">
            <p className="text-blackrose font-semibold">General Setting</p>
          </li>

          {generalNavigation.map((navigation) => {
            const isCurrentTab = pathname.startsWith(
              "/" + navigation.name.toLowerCase(),
            );

            return (
              <li
                key={navigation.name}
                className={classNames(
                  isCurrentTab ? "bg-charged-blue" : "",
                  "flex mx-5 my-[5px] rounded-md p-2 leading-6",
                )}
              >
                <img
                  src={navigation.icon}
                  alt={navigation.name}
                  className="w-6 h-6 self-center ml-2.5 mr-4"
                  draggable="false"
                />

                <Link
                  to={navigation.href}
                  className={classNames(
                    isCurrentTab ? "hover:text-white" : "",
                    "font-roboto font-normal text-blackrose",
                  )}
                >
                  {navigation.text}
                </Link>
              </li>
            );
          })}

          <hr className="border-t border-philippine-silver mx-5 my-2.5 h-2.5 mt-4" />

          <li className="mx-5 my-2.5 p-2">
            <p className="text-blackrose font-semibold">Event Setting</p>
          </li>

          {eventNavigation.map((navigation) => {
            const isCurrentTab = pathname.startsWith(
              "/" + navigation.name.toLowerCase(),
            );
            return (
              <li
                key={navigation.name}
                className={classNames(
                  isCurrentTab ? "bg-charged-blue" : "bg-white",
                  "flex mx-5 my-[5px] rounded-md p-2 leading-6",
                )}
              >
                <img
                  src={navigation.icon}
                  alt={navigation.name}
                  className="w-6 h-6 self-center ml-2.5 mr-4"
                  draggable="false"
                />

                <Link
                  to={navigation.href}
                  className={classNames(
                    isCurrentTab ? "hover:text-white" : "",
                    "font-normal font-roboto text-blackrose",
                  )}
                >
                  {navigation.text}
                </Link>
              </li>
            );
          })}

          <hr className="border-t border-philippine-silver mx-5 my-2.5 h-2.5 mt-4" />

          <li className="mx-5 my-2.5 p-2">
            <p className="text-blackrose font-semibold">Game Setting</p>
          </li>

          {gameNavigation.map((navigation) => {
            const isCurrentTab = pathname.startsWith(
              "/" + navigation.name.toLowerCase(),
            );

            return (
              <li
                key={navigation.name}
                className={classNames(
                  isCurrentTab ? "bg-charged-blue" : "bg-white",
                  "flex mx-5 my-[5px] rounded-md p-2 leading-6",
                )}
              >
                <img
                  src={navigation.icon}
                  alt={navigation.name}
                  className="w-6 h-6 self-center ml-2.5 mr-4"
                  draggable="false"
                />

                <Link
                  to={navigation.href}
                  className={classNames(
                    isCurrentTab ? "hover:text-white" : "",
                    "font-normal font-roboto text-blackrose",
                  )}
                >
                  {navigation.text}
                </Link>
              </li>
            );
          })}

          
        </ul>
      </div>
        <div className="bg-white flex mx-5 mb-6 rounded-md p-2 leading-6 items-center">
          <img
            src="/images/logout.svg"
            alt="Logout"
            className="w-6 h-6 self-center ml-2.5 mr-4"
            draggable="false"
          />

          <button
            onClick={openModal}
            className="text-blackrose text-sm font-normal font-kanit"
          >
            Logout
          </button>
        </div>

    </div>
  );
}
