export type Difficulty = "easy" | "medium" | "hard";
export type NumberValues = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
export type Coordinate = [number, number];
export type CellValue = null | "bomb" | NumberValues;
export type MineField = CellValue[][];
