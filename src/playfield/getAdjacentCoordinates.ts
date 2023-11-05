import { Coordinate } from "./playfield";

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
    if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
      adjacentCoordinates.push([newX, newY]);
    }
  }

  return adjacentCoordinates;
};
