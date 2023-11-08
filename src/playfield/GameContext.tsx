import type { FC, ReactNode } from "react";
import { createContext, useContext } from "react";
import { UseGameState } from "./useGameState";

export type GameContext = UseGameState;

export type GameProviderProps = {
  value: GameContext;
  children: ReactNode;
};

const GameContext = createContext<GameContext>({} as GameContext);

export const GameProvider: FC<GameProviderProps> = ({ value, children }) => {
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGameContext = () => useContext(GameContext);
