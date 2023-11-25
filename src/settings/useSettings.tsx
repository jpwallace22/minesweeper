import { WebviewWindow } from '@tauri-apps/api/window';
import { useEffect, useReducer } from 'react';
import { GRID_DATA } from '../constants';
import { useListen } from '../utils/useListen';
import { useStorage } from '../utils/useStorage';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Store {
  difficulty: Difficulty;
}

export interface GameSettings extends Store {
  height: number;
  width: number;
  bombCount: number;
}

interface SetDifficultyAction {
  type: 'SET_DIFFICULTY';
  payload: Difficulty;
}

type SettingsActions = SetDifficultyAction;

export const settingsReducer = (
  state: GameSettings,
  action: SettingsActions
) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_DIFFICULTY':
      return { ...state, difficulty: payload, ...GRID_DATA[payload] };
    default:
      return state;
  }
};

export type UseSettings = ReturnType<typeof useSettings>;

export const useSettings = () => {
  const [state, dispatch] = useReducer(settingsReducer, {
    difficulty: 'easy',
    ...GRID_DATA['easy'],
  });
  const [store, setStore] = useStorage('settings', { difficulty: 'easy' });

  // Listen for/create menu windows
  useListen('windows', ({ payload }: { payload: 'scores' }) => {
    if (payload === 'scores') {
      new WebviewWindow('scores', {
        url: '../high_scores.html',
        title: 'High Scores',
        width: 400,
        height: 600,
      });
    }
  });

  useEffect(() => {
    dispatch({ type: 'SET_DIFFICULTY', payload: store.difficulty });
  }, [store.difficulty]);

  useListen('difficulty_setting', ({ payload }: { payload: Difficulty }) => {
    const difficulty = payload;
    setStore({ ...store, difficulty });
  });

  return state;
};
