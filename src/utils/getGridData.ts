import { Coordinate, MineField, NumberValues } from '../game/gameTypes';
import { GameSettings } from '../settings/useSettings';

type GridData = Pick<GameSettings, 'height' | 'width' | 'bombCount'>;

/**
 * Generates a minefield grid based on the specified difficulty level.
 *
 * @param difficulty - The difficulty level of the grid. It can be "easy", "medium", or "hard".
 * @returns The generated minefield grid based on the specified difficulty level. Each cell can either be undefined or contain a "bomb" value.
 */
export const getGridData = (settings: GridData) => {
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
}: Pick<GameSettings, 'height' | 'width'>): MineField =>
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
}: GridData): Set<Coordinate> {
  if (bombCount > width * height) {
    throw new Error('Number of coordinates requested exceeds grid size.');
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
  bombCoords.forEach(([x, y]) => (minefield[y][x] = 'bomb'));
  return minefield;
};

/**
 * Adds cell number values to a grid by counting the number of bombs adjacent to each cell.
 *
 * @param {Object} params - The parameters object.
 * @param {MineField} params.gridWithBombs - The grid with bombs represented by the string 'bomb'.
 * @param {number} params.height - The height of the grid.
 * @param {number} params.width - The width of the grid.
 * @returns {MineField} - The grid with cell values added based on the number of adjacent bombs.
 */
const addCellValuesToGrid = ({
  gridWithBombs,
  height,
  width,
}: {
  gridWithBombs: MineField;
} & Pick<GameSettings, 'height' | 'width'>) => {
  const minefield = gridWithBombs;
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (minefield[i][j] !== 'bomb') {
        let bombTouchingCount = 0;
        const adjacentCoords = getAdjacentCoordinates({
          coordinate: [i, j],
          height,
          width,
        });
        for (const [x, y] of adjacentCoords) {
          if (minefield[x][y] === 'bomb') {
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

/**
 * Returns an array of adjacent coordinates based on the given coordinate, height, and width (to prevent leaving the grid).
 *
 * @param {Object} options - The options object.
 * @param {Coordinate} options.coordinate - The coordinate for which adjacent coordinates need to be found.
 * @param {number} options.height - The height of the grid.
 * @param {number} options.width - The width of the grid.
 * @returns {Coordinate[]} - An array of adjacent coordinates.
 */
export const getAdjacentCoordinates = ({
  coordinate,
  height,
  width,
}: {
  coordinate: Coordinate;
  height: number;
  width: number;
}): Coordinate[] => {
  const adjacentCoordinates: Coordinate[] = new Array();
  const [x, y] = coordinate;
  const offsets = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (const offset of offsets) {
    const newX = x + offset[0];
    const newY = y + offset[1];

    if (newX >= 0 && newX < height && newY >= 0 && newY < width) {
      adjacentCoordinates.push([newX, newY]);
    }
  }

  return adjacentCoordinates;
};
