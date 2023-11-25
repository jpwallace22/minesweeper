import { invoke } from '@tauri-apps/api';
import { useEffect, useReducer } from 'react';
import { GameSettings } from '../settings/useSettings';
import { getGridData } from '../utils/getGridData';
import { useListen } from '../utils/useListen';
import { GameStateActions, MineField } from './gameTypes';
import { useStorage } from '../utils/useStorage';
import { useConfig } from '../utils/useConfig';
import { message } from '../utils/message';

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

const timer = new Worker('./src/utils/timer_worker.ts');

export const useGameState = (settings: GameSettings) => {
  const { isWeb } = useConfig();
  const [scores, saveScores] = useStorage('scores');
  const [state, setGameState] = useReducer(GameStateReducer, {
    ...resettableState,
    minefield: [],
  });

  const { height, width, bombCount, difficulty } = settings;
  const { activeCells, finished, running, time } = state;

  // Invoke Web worker async timer (Web)
  useEffect(() => {
    if (!isWeb) return;
    if (running) {
      timer.postMessage('START');
    } else {
      timer.postMessage('STOP');
    }
  }, [running]);

  useEffect(() => {
    if (!isWeb) return;
    timer.onmessage = e => {
      setGameState({ type: 'SET_TIMER', payload: e.data });
    };
  }, []);

  // Invoke Rust async timer
  useEffect(() => {
    if (isWeb) return;
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

      message({
        message: `Difficulty: ${
          difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
        }
Time: ${time} seconds
Play again?`,
        title: 'Congratulations! You won!!',
        isWeb,
      });
      // message(
      //   `Difficulty: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      //    Time: ${time} seconds
      //    Play again?`,
      //   'Congratulations! You won!!'
      // );

      saveScores({
        ...scores,
        [difficulty]: [...scores[difficulty], formatTime(time)],
      });
    }
  }, [activeCells.size]);

  return [state, setGameState] as const;
};

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  return `${minutes}:${seconds}`;
};
