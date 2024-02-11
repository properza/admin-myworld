import React, { useState } from "react";
import Search from "./Search";

interface TabItem {
  label: string;
  content?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  search?: string;
  setSearch?: React.Dispatch<React.SetStateAction<string>>;
  isSearch?: boolean;
  onChange?: (currentTab: number) => void;
}

const TabsComponent: React.FC<TabsProps> = ({
  tabs,
  search,
  setSearch,
  isSearch = false,
  onChange
}) => {
  const [currentTabs, setCurrentTabs] = useState(0);
  const handleTabClick = (index: number) => {
    setCurrentTabs(index);
    onChange?.(index)
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between text-sm font-medium text-center text-gray-500 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px">
          {tabs.map((tab, index) => (
            <li key={index} className="me-2">
              <div
                onClick={() => handleTabClick(index)}
                className={`inline-block p-2 border-b-2 border-[#28B7E1] rounded-t-lg cursor-pointer ${
                  index === currentTabs ? "text-[#28B7E1]" : "border-none"
                } text-base`}
              >
                {tab.label}
              </div>
            </li>
          ))}
        </ul>
        {isSearch ? <Search filter={search as string} setFilter={setSearch!} /> : null}
      </div>
      <div className="h-full">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`${
              index === currentTabs ? "" : "hidden"
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
