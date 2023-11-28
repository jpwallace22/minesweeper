import { cva } from 'class-variance-authority';
import { Cell } from './Cell';
import { useGameContext } from './GameContext';
import { Coordinate } from './gameTypes';

const gridStyles = cva(['border-topDark-lg'], {
  variants: {
    disabled: {
      true: 'pointer-events-none',
    },
  },
});

export const Grid = () => {
  const { minefield, finished } = useGameContext();

  return (
    <div className="p-2 bg-gray-300">
      <div className={gridStyles({ disabled: !!finished })}>
        {minefield.map((row, x) => (
          <div key={x} className="flex">
            {row.map((cellValue, y) => {
              const coordinate: Coordinate = [x, y];
              return (
                <Cell
                  key={`${x}-${y}`}
                  value={cellValue}
                  coordinate={coordinate}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
