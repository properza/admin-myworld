import React, { useEffect, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { useSearchParams } from "@remix-run/react";
import Search from "./Search";

interface TabItem {
  name: string;
  label: string;
  content?: React.ReactNode;
}

interface DateType {
  startDate: Date | string;
  endDate: Date | string;
}

interface TabsProps {
  tabs: TabItem[];
  search?: string;
  setSearch?: React.Dispatch<React.SetStateAction<string>>;
  isShowSearch?: boolean;
  isShowDate?: boolean;
  onChange?: (currentTab: number) => void;
  dateValue?: DateType;
  onChangeDate?: (value: DateType) => void;
}

const TabsComponent: React.FC<TabsProps> = ({
  tabs,
  search,
  setSearch,
  isShowSearch = false,
  isShowDate = false,
  onChange,
  dateValue,
  onChangeDate,
}) => {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get("tab");
  const handleTabClick = (name: string, index: number) => {
    window.location.href = "orders?tab=" + name;
    onChange?.(index);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between text-sm font-medium text-center text-gray-500 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px">
          {tabs.map((tab, index) => (
            <li key={index} className="me-2">
              <div
                onClick={() => handleTabClick(tab.name, index)}
                className={`inline-block p-2 border-b-2 border-[#28B7E1] rounded-t-lg cursor-pointer ${
                  tab.name === currentTab ? "text-[#28B7E1]" : "border-none"
                } text-base`}
              >
                {tab.label}
              </div>
            </li>
          ))}
        </ul>
        <div className="flex flex-row gap-x-3">
          {isShowDate ? (
            <Datepicker
              primaryColor={"blue"}
              value={dateValue!}
              onChange={(value) =>
                onChangeDate && onChangeDate(value as DateType)
              }
            />
          ) : null}
          {isShowSearch ? (
            <Search filter={search as string} setFilter={setSearch!} />
          ) : null}
        </div>
      </div>
      <div className="h-full">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`${
              tab.name === currentTab ? "" : "hidden"
            } px-2 py-4 rounded-lg bg-gray-50 h-full`}
            role="tabpanel"
            aria-labelledby={`${tab.label}-tab`}
          >
            {tab.content || (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This page will be available soon.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabsComponent;
