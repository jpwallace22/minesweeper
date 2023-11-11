import { message } from '@tauri-apps/api/dialog';
import { useEffect, useMemo, useReducer } from 'react';
import { GameSettings } from '../settings/useSettings';
import { getGridData } from './getGridData';
import { MineField } from './playfield';

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
  payload: string[];
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
      return {
        ...state,
        activeCells: new Set([...state.activeCells, ...action.payload]),
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

const timer = new Worker('./src/playfield/timer.ts');

export const useGameState = (settings: GameSettings) => {
  const { height, width, bombCount } = settings;
  const [state, dispatch] = useReducer(GameStateReducer, {
    ...resettableState,
    minefield: [],
  });
  const { activeCells, finished, running } = state;
  console.log('🔍 ~ useGameState ~ running:', running);
  console.log('🔍 ~ useGameState ~ finished:', finished);

  useEffect(() => {
    timer.onmessage = e => {
      dispatch({ type: 'SET_TIMER', payload: e.data });
    };
  }, []);

  useEffect(() => {
    if (running) {
      timer.postMessage('START');
    } else {
      console.log('stop fired');
      timer.postMessage('STOP');
    }
  }, [running]);

  useMemo(() => {
    const { minefield } = getGridData(settings);
    dispatch({ type: 'RESET_GAME', payload: minefield });
  }, [settings.height, settings.height, settings.bombCount]);

  if (activeCells.size === height * width - bombCount && !finished) {
    dispatch({
      type: 'START_STOP',
      payload: { finished: 'win', running: false },
    });
    message('You won. Play again?', 'Congratulations!!');
  }

  return [state, dispatch] as const;
};
