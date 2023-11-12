import { cva } from 'class-variance-authority';
import { ComponentPropsWithoutRef, FC, MouseEvent, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { useSettingsContext } from '../settings/SettingsContext';
import { useGameContext } from './GameContext';
// import Icon from './Icons';
import { CellValue, Coordinate, NumberValues } from './playfield';
import { getAdjacentCoordinates } from '../utils/getGridData';

interface CellProps extends Omit<ComponentPropsWithoutRef<'button'>, 'value'> {
  coordinate: Coordinate;
  value: CellValue;
}

const styles = cva(
  [
    'h-8 w-8',
    'border border-slate-400',
    'text-black text-2xl font-black',
    'grid place-items-center',
  ],
  {
    variants: {
      isBomb: {
        true: '',
      },
      active: {
        true: 'bg-gray-300 pointer-events-none',
        false: [
          'bg-gray-400',
          'border-3',
          'border-b-gray-500',
          'border-r-gray-500',
          'border-l-white',
          'border-t-white',
          'cursor-pointer',
        ],
      },
    },
    compoundVariants: [
      {
        active: true,
        isBomb: true,
        className: 'bg-red-500',
      },
    ],
  }
);
export const Cell: FC<CellProps> = ({ coordinate, value, ...props }) => {
  const { height, width } = useSettingsContext();

  const [{ activeCells, flaggedCells, minefield, running }, setGameState] =
    useGameContext();
  const ref = useRef<HTMLButtonElement>(null);
  const isBomb = value === 'bomb';
  const isFlagged = flaggedCells.has(JSON.stringify(coordinate));
  const isActive = activeCells.has(JSON.stringify(coordinate));

  const evaluateAdjacentCells = ({
    currentCell,
    evaluated = [],
  }: {
    currentCell: Coordinate;
    evaluated?: string[];
  }) => {
    const [x, y] = currentCell;
    evaluated.push(JSON.stringify(currentCell));

    if (!minefield[x][y]) {
      const adjacentCoordinates = getAdjacentCoordinates({
        coordinate: currentCell,
        height,
        width,
      });

      for (const neighborCell of adjacentCoordinates) {
        if (!evaluated.includes(JSON.stringify(neighborCell))) {
          evaluateAdjacentCells({
            currentCell: neighborCell,
            evaluated,
          });
        }
      }
    }

    return evaluated;
  };

  const onCellClick = (coordinate: Coordinate) => {
    if (isFlagged) return;

    if (!running) {
      setGameState({
        type: 'START_STOP',
        payload: { finished: null, running: true },
      });
    }

    if (isBomb) {
      setGameState({
        type: 'START_STOP',
        payload: { finished: 'loss', running: false },
      });
    }

    const cellsToMakeActive = evaluateAdjacentCells({
      currentCell: coordinate,
    });
    setGameState({ type: 'ADD_ACTIVE_CELLS', payload: cellsToMakeActive });
  };

  const onRightClick = (e: MouseEvent, coordinate: Coordinate) => {
    e.preventDefault();
    if (isActive) return;

    if (isFlagged) {
      setGameState({
        type: 'REMOVE_FLAGGED_CELL',
        payload: JSON.stringify(coordinate),
      });
    } else {
      setGameState({
        type: 'ADD_FLAGGED_CELL',
        payload: JSON.stringify(coordinate),
      });
    }
  };

  const onMouseDown = (e: MouseEvent) => {
    if (e.button === 0 && !isFlagged) {
      ref.current?.classList.add('pressed');
    }
  };

  const onMouseUp = () => {
    ref.current?.classList.remove('pressed');
  };

  return (
    <button
      ref={ref}
      className={twMerge(styles({ active: isActive, isBomb }))}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseOut={onMouseUp}
      onClick={() => onCellClick(coordinate)}
      onContextMenu={e => onRightClick(e, coordinate)}
      {...props}
    >
      {isActive && <Icon id={value} />}
      {isFlagged && <Icon id="flag" />}
    </button>
  );
};

type MineFieldIcons = 'flag' | 'bomb' | NumberValues;

interface IconProps extends Omit<ComponentPropsWithoutRef<'svg'>, 'id'> {
  id?: MineFieldIcons | null;
  size?: number;
}

const Icon: FC<IconProps> = ({ id, className, fill, stroke, size, ...props }) =>
  id ? (
    <svg
      width={size || 24}
      height={size || 24}
      role="img"
      aria-label={id}
      {...props}
    >
      <use href={`/sprite.svg#${id}`} />
    </svg>
  ) : null;
