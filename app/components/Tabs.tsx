import React, { useState } from 'react';

interface TabItem {
    label : string 
    content? : React.ReactNode;
  }

interface TabsProps {
    tabs: TabItem[];
}

const TabsComponent: React.FC<TabsProps> = ({ tabs }) => {

    const [currentTabs, setCurrentTabs] = useState(0);
    const handleTabClick = (index : number) => {
        setCurrentTabs(index);
    }

  return (
    <div className="flex flex-col">
        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200">
            <ul className="flex flex-wrap -mb-px">
                {tabs.map((tab, index) => (
                  <li key={index} className="me-2">
                    <div
                      onClick={() => handleTabClick(index)}
                      className={`inline-block p-2 border-b-2 border-[#28B7E1] rounded-t-lg cursor-pointer ${index === currentTabs ? 'text-[#28B7E1]' : 'border-none'} text-base`}
                    >
                      {tab.label}
                    </div>
                    
                  </li>
                ))}
            </ul>
        </div>
        <div>
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={`${
                index === currentTabs ? '' : 'hidden'
              } px-2 py-4 rounded-lg bg-gray-50`}
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
