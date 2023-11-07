import { listen } from "@tauri-apps/api/event";
import { useReducer } from "react";
import { settingsReducer } from "./settingsReducer";
import { GameSettings } from "./settings";

export type UseSettings = ReturnType<typeof useSettings>;

export const useSettings = () => {
  const [state, dispatch] = useReducer(settingsReducer, { difficulty: "easy" });

  listen(
    "difficulty_setting",
    ({ payload }: { payload: GameSettings["difficulty"] }) =>
      dispatch({ type: "SET_DIFFICULTY", payload })
  );

  return state;
};
