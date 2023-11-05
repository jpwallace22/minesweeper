import { getAdjacentCoordinates } from "./getAdjacentCoordinates";
import { Coordinate, Difficulty, MineField, NumberValues } from "./playfield";

interface GetGridDataArgs {
  difficulty: Difficulty;
}

interface GridSettings {
  width: number;
  height: number;
  bombCount: number;
}

const gridData = {
  easy: {
    width: 9,
    height: 9,
    bombCount: 10,
  },
  medium: {
    width: 16,
    height: 16,
    bombCount: 32,
  },
  hard: {
    width: 30,
    height: 16,
    bombCount: 60,
  },
};

/**
 * Generates a minefield grid based on the specified difficulty level.
 *
 * @param difficulty - The difficulty level of the grid. It can be "easy", "medium", or "hard".
 * @returns The generated minefield grid based on the specified difficulty level. Each cell can either be undefined or contain a "bomb" value.
 */
export const getGridData = ({ difficulty }: GetGridDataArgs) => {
  const settings = gridData[difficulty];
  const grid = generateGrid(settings);
  const bombCoords = generateBombCoordinates(settings);
  const gridWithBombs = addBombsToGrid({ grid, bombCoords });
  const minefield = addCellValuesToGrid({ gridWithBombs, ...settings });

  return { minefield, ...settings };
};

/**
 * Generates a two-dimensional array representing a minefield grid with the specified width and height.
 *
 * @param {number} obj.width - The width of the grid.
 * @param {number} obj.height - The height of the grid.
 * @returns {MineField} - A two-dimensional array representing the minefield grid with dimensions width x height. Each element in the array is initially set to undefined.
 */
const generateGrid = ({
  width,
  height,
}: Pick<GridSettings, "height" | "width">): MineField =>
  Array.from({ length: height }).map(() => Array.from({ length: width }));

/**
 * Generates a set of random bomb coordinates for a minefield grid.
 *
 * @param {number} obj.bombCount - The number of bombs to generate coordinates for.
 * @param {number} obj.width - The width of the minefield grid.
 * @param {number} obj.height - The height of the minefield grid.
 * @returns {Set<[number, number]>} A set of randomly generated bomb coordinates, where each coordinate is represented as an array of two numbers [x, y].
 * @throws {Error} If the number of bombs requested exceeds the size of the grid.
 */
function generateBombCoordinates({
  bombCount,
  width,
  height,
}: GridSettings): Set<Coordinate> {
  if (bombCount > width * height) {
    throw new Error("Number of coordinates requested exceeds grid size.");
  }
  const coordinates: Set<string> = new Set();

  while (coordinates.size < bombCount) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    coordinates.add(JSON.stringify([x, y]));
  }

  const result: Set<Coordinate> = new Set();
  for (const coord of coordinates) {
    result.add(JSON.parse(coord));
  }

  return result;
}

/**
 * Adds bombs to the grid at the specified coordinates.
 *
 * @param {MineField} obj.grid - The grid to add bombs to.
 * @param {Set<Coordinate>} obj.bombCoords - A set of bomb coordinates, where each coordinate is represented as an array of two numbers [x, y].
 * @returns {MineField} The grid with bombs added at the specified coordinates.
 */
const addBombsToGrid = ({
  grid,
  bombCoords,
}: {
  grid: MineField;
  bombCoords: Set<Coordinate>;
}): MineField => {
  const minefield = grid;
  bombCoords.forEach(([x, y]) => (minefield[y][x] = "bomb"));
  return minefield;
};

const addCellValuesToGrid = ({
  gridWithBombs,
  height,
  width,
}: {
  gridWithBombs: MineField;
} & Pick<GridSettings, "height" | "width">) => {
  const minefield = gridWithBombs;
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (minefield[i][j] !== "bomb") {
        let bombTouchingCount = 0;
        const adjacentCoords = getAdjacentCoordinates({
          coordinate: [i, j],
          height,
          width,
        });
        for (const [x, y] of adjacentCoords) {
          if (minefield[x][y] === "bomb") {
            bombTouchingCount++;
          }
        }
        minefield[i][j] = bombTouchingCount
          ? (String(bombTouchingCount) as NumberValues)
          : null;
      }
    }
  }

  return minefield;
};
