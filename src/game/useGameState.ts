import { invoke } from '@tauri-apps/api';
import { message } from '@tauri-apps/api/dialog';
import { useEffect, useReducer } from 'react';
import { GameSettings } from '../settings/useSettings';
import { getGridData } from '../utils/getGridData';
import { useListen } from '../utils/useListen';
import { GameStateActions, MineField } from './game';
import { useTauriStore } from '../utils/useTauriStore';

export interface GameState {
  running: boolean;
  minefield: MineField;
  finished: null | 'win' | 'loss';
  time: number;
  activeCells: Set<string>;
  flaggedCells: Set<string>;
}

export type UseGameState = ReturnType<typeof useGameState>;

const resettableState = {
  activeCells: new Set<string>(),
  flaggedCells: new Set<string>(),
  finished: null,
  running: false,
  time: 0,
};

export const GameStateReducer = (
  state: GameState,
  action: GameStateActions
): GameState => {
  switch (action.type) {
    case 'ADD_ACTIVE_CELLS':
      const cellsToAdd: string[] =
        typeof action.payload[0] === 'string'
          ? (action.payload as string[])
          : action.payload.map(coord => JSON.stringify(coord));
      return {
        ...state,
        activeCells: new Set([...state.activeCells, ...cellsToAdd]),
      };

    case 'ADD_FLAGGED_CELL':
      const cellToAdd =
        typeof action.payload !== 'string'
          ? JSON.stringify(action.payload)
          : action.payload;
      return {
        ...state,
        flaggedCells: new Set([...state.flaggedCells, cellToAdd]),
      };

    case 'REMOVE_FLAGGED_CELL':
      return {
        ...state,
        flaggedCells: new Set(
          [...state.flaggedCells].filter(coord => coord !== action.payload)
        ),
      };

    case 'START_STOP':
      return {
        ...state,
        ...action.payload,
      };

    case 'SET_TIMER':
      return {
        ...state,
        time: action.payload,
      };

    case 'RESET_GAME':
      return {
        ...resettableState,
        minefield: action.payload,
      };

    default:
      return state;
  }
};

// const timer = new Worker('./src/utils/timer.ts');

export const useGameState = (settings: GameSettings) => {
  const [scores, saveScoresToDisc] = useTauriStore('scores', {
    easy: [],
    medium: [],
    hard: [],
    custom: [],
  });

  const [state, setGameState] = useReducer(GameStateReducer, {
    ...resettableState,
    minefield: [],
  });
  const { height, width, bombCount, difficulty } = settings;
  const { activeCells, finished, running, time } = state;

  // TODO: use web worker for web version
  // useEffect(() => {
  //   timer.onmessage = e => {
  //     setGameState({ type: 'SET_TIMER', payload: e.data });
  //   };
  // }, []);

  // useEffect(() => {
  //   if (running) {
  //     timer.postMessage('START');
  //   } else {
  //     timer.postMessage('STOP');
  //   }
  // }, [running]);

  // Invoke Rust async timer
  useEffect(() => {
    if (running) {
      invoke('timer', { method: 'start' });
    } else {
      invoke('timer', { method: 'stop' });
    }
  }, [running]);

  // Listen for timer updates and update state
  useListen('timer_tick', ({ payload }: { payload: number }) => {
    setGameState({ type: 'SET_TIMER', payload });
  });

  // adjust minefield when update grid to settings
  useEffect(() => {
    const { minefield } = getGridData({ height, width, bombCount });
    setGameState({ type: 'RESET_GAME', payload: minefield });
  }, [settings.height, settings.width, settings.bombCount]);

  // Win condition
  useEffect(() => {
    if (activeCells.size === height * width - bombCount && !finished) {
      setGameState({
        type: 'START_STOP',
        payload: { finished: 'win', running: false },
      });
      message(
        `Difficulty: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
         Time: ${time} seconds
         Play again?`,
        'Congratulations! You won!!'
      );
      saveScoresToDisc({
        ...scores,
        [difficulty]: [...scores[difficulty], time],
      });
    }
  }, [activeCells.size]);

  return [state, setGameState] as const;
};
