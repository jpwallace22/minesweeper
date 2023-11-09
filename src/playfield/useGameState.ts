import { useReducer } from "react";
import { GameSettings } from "../settings/useSettings";
import { message } from "@tauri-apps/api/dialog";

export interface GameState {
  activeCells: Set<string>;
  flaggedCells: Set<string>;
  finished: null | "win" | "loss";
}

interface ActiveCellsAction {
  type: "ADD_ACTIVE_CELLS";
  payload: string[];
}

interface FlaggedCellsAction {
  type: "ADD_FLAGGED_CELL" | "REMOVE_FLAGGED_CELL";
  payload: string;
}

interface ResetGameAction {
  type: "RESET_GAME";
  payload?: string;
}

interface FinishGameAction {
  type: "FINISH_GAME";
  payload: "win" | "loss";
}

type GameStateActions =
  | ActiveCellsAction
  | FlaggedCellsAction
  | ResetGameAction
  | FinishGameAction;

export type UseGameState = ReturnType<typeof useGameState>;

const initialState = {
  activeCells: new Set<string>(),
  flaggedCells: new Set<string>(),
  finished: null,
};

export const GameStateReducer = (
  state: GameState,
  action: GameStateActions
): GameState => {
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
    case "FINISH_GAME":
      return {
        ...state,
        finished: payload,
      };
    case "RESET_GAME":
      return initialState;
    default:
      return state;
  }
};

export const useGameState = ({ height, width, bombCount }: GameSettings) => {
  const [state, dispatch] = useReducer(GameStateReducer, initialState);

  if (
    state.activeCells.size === height * width - bombCount &&
    !state.finished
  ) {
    dispatch({ type: "FINISH_GAME", payload: "win" });
    message("You won. Play again?", {
      title: "Congratulations!!",
      type: "info",
    });
  }

  return [state, dispatch] as const;
};
