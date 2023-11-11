import { listen } from '@tauri-apps/api/event';
import { useReducer } from 'react';

export type Difficulty = 'easy' | 'medium' | 'hard';
export interface GameSettings {
  width: number;
  height: number;
  bombCount: number;
}

interface SetDifficultyAction {
  type: 'SET_DIFFICULTY';
  payload: Difficulty;
}

type SettingsActions = SetDifficultyAction;

const gridData = {
  easy: {
    width: 9,
    height: 9,
    bombCount: 10,
  },
  medium: {
    width: 16,
    height: 16,
    bombCount: 32,
  },
  hard: {
    width: 30,
    height: 16,
    bombCount: 60,
  },
};

export const settingsReducer = (
  state: GameSettings,
  action: SettingsActions
) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_DIFFICULTY':
      return { ...state, ...gridData[payload] };
    default:
      return state;
  }
};

export type UseSettings = ReturnType<typeof useSettings>;

export const useSettings = () => {
  const [state, dispatch] = useReducer(settingsReducer, {
    ...gridData['easy'],
  });

  listen('difficulty_setting', ({ payload }: { payload: Difficulty }) =>
    dispatch({ type: 'SET_DIFFICULTY', payload })
  );

  return state;
};
