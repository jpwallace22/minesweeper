import { GameSettings } from "./settings";

interface SetDifficultyAction {
  type: "SET_DIFFICULTY";
  payload: GameSettings["difficulty"];
}

type SettingsActions = SetDifficultyAction;

export const settingsReducer = (
  state: GameSettings,
  action: SettingsActions
) => {
  switch (action.type) {
    case "SET_DIFFICULTY":
      return { ...state, difficulty: action.payload };
    default:
      return state;
  }
};
