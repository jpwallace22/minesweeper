import type { FC, ReactNode } from 'react';
import { createContext, useContext } from 'react';

export type ConfigContext = {
  isWeb: boolean;
};

export type ConfigProviderProps = {
  value: ConfigContext;
  children: ReactNode;
};

const Context = createContext<ConfigContext>({} as ConfigContext);

export const ConfigProvider: FC<ConfigProviderProps> = ({
  value,
  children,
}) => {
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useConfig = () => useContext(Context);
