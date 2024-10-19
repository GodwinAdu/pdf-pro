import React, { FC, ReactNode } from 'react';

interface TabsProps {
  selectedTab: string;
  onSelect: (tab: string) => void;
  children: ReactNode;
}

export const Tabs: FC<TabsProps> = ({ selectedTab, onSelect, children }) => {
  return (
    <div className="mt-6">
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            const { value, label } = child.props;
            return (
              <button
                className={`px-4 py-2 font-medium text-sm transition-all ${
                  selectedTab === value
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-500'
                }`}
                onClick={() => onSelect(value)}
              >
                {label}
              </button>
            );
          }
        })}
      </div>

      <div className="mt-4">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return selectedTab === child.props.value ? child : null;
          }
        })}
      </div>
    </div>
  );
};
