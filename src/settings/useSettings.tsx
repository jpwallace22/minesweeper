import { useEffect, useReducer } from 'react';
import { useListen } from '../utils/useListen';
import { useTauriStore } from '../utils/useTauriStore';

export type Difficulty = 'easy' | 'medium' | 'hard';
export interface Store {
  difficulty: Difficulty;
}
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
    bombCount: 40,
  },
  hard: {
    width: 30,
    height: 16,
    bombCount: 99,
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
  const [state, dispatch] = useReducer(settingsReducer, gridData.easy);
  const [store, setStore] = useTauriStore<Store>('settings', {
    difficulty: 'easy',
  });

  useEffect(() => {
    dispatch({ type: 'SET_DIFFICULTY', payload: store.difficulty });
  }, [store.difficulty]);

  useListen('difficulty_setting', ({ payload }: { payload: Difficulty }) => {
    setStore({ ...store, difficulty: payload });
  });

  return state;
};
