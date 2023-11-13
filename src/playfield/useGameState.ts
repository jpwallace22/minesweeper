import { invoke } from '@tauri-apps/api';
import { message } from '@tauri-apps/api/dialog';
import { useEffect, useReducer } from 'react';
import { GameSettings } from '../settings/useSettings';
import { getGridData } from '../utils/getGridData';
import { useListen } from '../utils/useListen';
import { Coordinate, MineField } from './playfield';

export interface GameState {
  running: boolean;
  minefield: MineField;
  finished: null | 'win' | 'loss';
  time: number;
  activeCells: Set<string>;
  flaggedCells: Set<string>;
}

interface ActiveCellsAction {
  type: 'ADD_ACTIVE_CELLS';
  payload: string[] | Coordinate[];
}

interface AddSecondToTime {
  type: 'SET_TIMER';
  payload: number;
}

interface FlaggedCellsAction {
  type: 'ADD_FLAGGED_CELL' | 'REMOVE_FLAGGED_CELL';
  payload: string;
}

interface ResetGameAction {
  type: 'RESET_GAME';
  payload: MineField;
}

interface StartStopGameAction {
  type: 'START_STOP';
  payload: {
    finished: 'win' | 'loss' | null;
    running: boolean;
  };
}

interface InitField {
  type: 'INIT_MINEFIELD';
  payload: MineField;
}

type GameStateActions =
  | ActiveCellsAction
  | FlaggedCellsAction
  | ResetGameAction
  | StartStopGameAction
  | InitField
  | AddSecondToTime;

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
      let cellsToAdd: string[] = [];
      if (typeof action.payload[0] === 'string') {
        cellsToAdd = action.payload as string[];
      } else {
        action.payload.forEach(coord => cellsToAdd.push(JSON.stringify(coord)));
      }
      return {
        ...state,
        activeCells: new Set([...state.activeCells, ...cellsToAdd]),
      };
    case 'ADD_FLAGGED_CELL':
      return {
        ...state,
        flaggedCells: new Set([...state.flaggedCells, action.payload]),
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
  const { height, width, bombCount } = settings;
  const [state, setGameState] = useReducer(GameStateReducer, {
    ...resettableState,
    minefield: [],
  });
  const { activeCells, finished } = state;

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

  useListen('timer_tick', ({ payload }: { payload: number }) => {
    setGameState({ type: 'SET_TIMER', payload });
  });

  useEffect(() => {
    const { minefield } = getGridData(settings);
    setGameState({ type: 'RESET_GAME', payload: minefield });
  }, [settings.height, settings.height, settings.bombCount]);

  if (activeCells.size === height * width - bombCount && !finished) {
    setGameState({
      type: 'START_STOP',
      payload: { finished: 'win', running: false },
    });
    invoke('timer', { method: 'stop' });
    message('You won. Play again?', 'Congratulations!!');
  }

  return [state, setGameState] as const;
};
