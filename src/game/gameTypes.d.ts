export type NumberValues = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
export type Coordinate = [number, number];
export type CellValue = null | 'bomb' | NumberValues;
export type MineField = CellValue[][];

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
  payload: string | Coordinate;
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

export type GameStateActions =
  | ActiveCellsAction
  | FlaggedCellsAction
  | ResetGameAction
  | StartStopGameAction
  | InitField
  | AddSecondToTime;
