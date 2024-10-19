import { FC, ReactNode } from 'react';

interface TabProps {
  label: string;
  value: string;
  children: ReactNode;
}

export const Tab: FC<TabProps> = ({ children }) => {
  return <div>{children}</div>;
};
