import type { FC, ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { UseGameState } from './useGameState';

export type GameContext = UseGameState;

export type GameProviderProps = {
  value: GameContext;
  children: ReactNode;
};

const Context = createContext<GameContext>({} as GameContext);

export const GameProvider: FC<GameProviderProps> = ({ value, children }) => {
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useGameContext = () => useContext(Context);
