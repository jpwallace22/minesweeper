import { Dispatch, MouseEvent, SetStateAction, useMemo, useState } from "react";
import { Cell } from "./Cell";
import { getAdjacentCoordinates } from "./getAdjacentCoordinates";
import { getGridData } from "./getGridData";
import { Coordinate } from "./playfield";

export const Grid = () => {
  const [activeCells, setActiveCells] = useState<Set<string>>(new Set());
  const [flaggedCells, setFlaggedCells] = useState<Set<string>>(new Set());

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

  const isActiveCell = (coordinate: Coordinate) =>
    activeCells.has(JSON.stringify(coordinate));

  const isFlaggedCell = (coordinate: Coordinate) =>
    flaggedCells.has(JSON.stringify(coordinate));

  const onCellClick = (coordinate: Coordinate) => {
    if (isFlaggedCell(coordinate)) return;
    const cellsToMakeActive = evaluateAdjacentCells({ coordinate });
    setActiveCells(prev => new Set([...prev, ...cellsToMakeActive]));
  };

  const onRightClick = (e: MouseEvent, coordinate: Coordinate) => {
    e.preventDefault();
    if (isActiveCell(coordinate)) return;

    if (isFlaggedCell(coordinate)) {
      setFlaggedCells(
        prev =>
          new Set(
            [...prev].filter(coord => coord !== JSON.stringify(coordinate))
          )
      );
    } else {
      setFlaggedCells(prev => new Set([...prev, JSON.stringify(coordinate)]));
    }
  };

  return (
    <div>
      {minefield.map((row, x) => (
        <div key={x} className="flex">
          {row.map((cellValue, y) => {
            const coordinate: Coordinate = [x, y];

            return (
              <Cell
                key={`${x}-${y}`}
                value={cellValue}
                coord={coordinate}
                onClick={() => onCellClick(coordinate)}
                onContextMenu={e => onRightClick(e, coordinate)}
                active={isActiveCell(coordinate)}
                flagged={isFlaggedCell(coordinate)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
