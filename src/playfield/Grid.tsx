import { useMemo, useState } from "react";
import { Cell } from "./Cell";
import { getAdjacentCoordinates } from "./getAdjacentCoordinates";
import { getGridData } from "./getGridData";
import { Coordinate } from "./playfield";

export const Grid = () => {
  const [activeCells, setActiveCells] = useState<Set<string>>(new Set());

  const { minefield, width, height } = useMemo(
    () => getGridData({ difficulty: "easy" }),
    []
  );

  /**
   * Recursively evaluates adjacent cells of a given coordinate in a minefield.
   * The function stops evaluating when it reaches a cell with a value.
   *
   * @returns An array of evaluated cell coordinates.
   */
  const evaluateAdjacentCells = ({
    coordinate,
    evaluated = [],
  }: {
    coordinate: Coordinate;
    evaluated?: string[];
  }) => {
    const [x, y] = coordinate;
    const coordString = JSON.stringify(coordinate);
    evaluated.push(coordString);

    if (!minefield[x][y]) {
      const adjacentCoordinates = getAdjacentCoordinates({
        coordinate,
        height,
        width,
      });

      for (const coord of adjacentCoordinates) {
        if (!evaluated.includes(JSON.stringify(coord))) {
          evaluateAdjacentCells({
            coordinate: coord,
            evaluated,
          });
        }
      }
    }

    return evaluated;
  };

  const onCellClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    coordinate?: Coordinate
  ) => {
    if (!coordinate) return;
    const cellsToMakeActive = evaluateAdjacentCells({ coordinate });

    const newActiveCells = new Set(activeCells);
    cellsToMakeActive.forEach(coord => newActiveCells.add(coord));
    setActiveCells(newActiveCells);
  };

  return (
    <>
      {minefield.map((row, x) => (
        <div key={x} className="flex">
          {row.map((cellValue, y) => {
            const coordinate: Coordinate = [x, y];

            return (
              <Cell
                key={`${x}-${y}`}
                value={cellValue}
                coord={coordinate}
                onClick={e => onCellClick(e, coordinate)}
                // onContextMenu={onCellClick}
                active={activeCells.has(JSON.stringify(coordinate))}
              />
            );
          })}
        </div>
      ))}
    </>
  );
};
