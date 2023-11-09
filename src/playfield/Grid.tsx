import { MouseEvent, useMemo } from "react";
import { useSettingsContext } from "../settings/SettingsContext";
import { Cell } from "./Cell";
import { useGameContext } from "./GameContext";
import { getAdjacentCoordinates } from "./getAdjacentCoordinates";
import { getGridData } from "./getGridData";
import { Coordinate } from "./playfield";
import { cva } from "class-variance-authority";

const gridStyles = cva(
  [
    "border-4 border-t-gray-500 border-l-gray-500 border-b-white border-r-white",
  ],
  {
    variants: {
      disabled: {
        true: "pointer-events-none",
      },
    },
  }
);

export const Grid = () => {
  const settings = useSettingsContext();
  const [{ activeCells, flaggedCells, finished }, dispatch] = useGameContext();
  console.log("🔍 ~ Grid ~ finished:", finished);

  const { minefield, width, height } = useMemo(
    () => getGridData(settings),
    [settings]
  );

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

  // TODO move to Cell with context
  const isActiveCell = (coordinate: Coordinate) =>
    activeCells.has(JSON.stringify(coordinate));

  const isFlaggedCell = (coordinate: Coordinate) =>
    flaggedCells.has(JSON.stringify(coordinate));

  const onCellClick = (coordinate: Coordinate) => {
    if (minefield[coordinate[0]][coordinate[1]] === "bomb") {
      dispatch({ type: "FINISH_GAME", payload: "loss" });
    }
    if (isFlaggedCell(coordinate)) return;
    const cellsToMakeActive = evaluateAdjacentCells({ coordinate });
    dispatch({ type: "ADD_ACTIVE_CELLS", payload: cellsToMakeActive });
  };

  const onRightClick = (e: MouseEvent, coordinate: Coordinate) => {
    e.preventDefault();
    if (isActiveCell(coordinate)) return;

    if (isFlaggedCell(coordinate)) {
      dispatch({
        type: "REMOVE_FLAGGED_CELL",
        payload: JSON.stringify(coordinate),
      });
    } else {
      dispatch({
        type: "ADD_FLAGGED_CELL",
        payload: JSON.stringify(coordinate),
      });
    }
  };

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
    </div>
  );
};
