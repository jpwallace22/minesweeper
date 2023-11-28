import type { FC, ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { UseSettings } from './useSettings';

export type SettingsContext = UseSettings;

export type SettingsProviderProps = {
  value: SettingsContext;
  children: ReactNode;
};

const Context = createContext<SettingsContext>({
  difficulty: 'easy',
} as SettingsContext);

export const SettingsProvider: FC<SettingsProviderProps> = ({
  value,
  children,
}) => {
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useSettingsContext = () => useContext(Context);
