import { useEffect, useReducer } from 'react';
import { useListen } from '../utils/useListen';
import { useTauriStore } from '../utils/useTauriStore';
import { GRID_DATA } from '../constants';

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
  const [store, setStore] = useTauriStore('settings', {
    difficulty: 'easy',
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
