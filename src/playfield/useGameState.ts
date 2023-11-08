import { useReducer } from "react";

interface GameState {
  activeCells: Set<string>;
  flaggedCells: Set<string>;
}

interface ActiveCells {
  type: "ADD_ACTIVE_CELLS";
  payload: string[];
}

interface FlaggedCells {
  type: "ADD_FLAGGED_CELL" | "REMOVE_FLAGGED_CELL";
  payload: string;
}

interface ResetGame {
  type: "RESET_GAME";
  payload?: string;
}

type GameStateActions = ActiveCells | FlaggedCells | ResetGame;

export type UseGameState = ReturnType<typeof useGameState>;

export const GameStateReducer = (
  state: GameState,
  action: GameStateActions
) => {
  const { type, payload } = action;
  switch (type) {
    case "ADD_ACTIVE_CELLS":
      return {
        ...state,
        activeCells: new Set([...state.activeCells, ...payload]),
      };
    case "ADD_FLAGGED_CELL":
      return {
        ...state,
        flaggedCells: new Set([...state.flaggedCells, payload]),
      };
    case "REMOVE_FLAGGED_CELL":
      return {
        ...state,
        flaggedCells: new Set(
          [...state.flaggedCells].filter(coord => coord !== payload)
        ),
      };
    case "RESET_GAME":
      return {
        activeCells: new Set<string>(),
        flaggedCells: new Set<string>(),
      };
    default:
      return state;
  }
};

export const useGameState = () => {
  const [state, dispatch] = useReducer(GameStateReducer, {
    activeCells: new Set<string>(),
    flaggedCells: new Set<string>(),
  });

  return [state, dispatch] as const;
};
