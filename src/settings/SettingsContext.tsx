import type { FC, ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { UseSettings } from './useSettings';

export type SettingsContext = UseSettings;

export type SettingsProviderProps = {
  value: SettingsContext;
  children: ReactNode;
};

const SettingsContext = createContext<SettingsContext>({} as SettingsContext);

export const SettingsProvider: FC<SettingsProviderProps> = ({
  value,
  children,
}) => {
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => useContext(SettingsContext);
