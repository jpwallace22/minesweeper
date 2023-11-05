import { cva } from "class-variance-authority";
import { ComponentPropsWithoutRef, FC } from "react";
import { CellValue, Coordinate } from "./playfield";
import { twMerge } from "tailwind-merge";

interface CellProps extends ComponentPropsWithoutRef<"div"> {
  active: boolean;
  value: CellValue;
  coord?: Coordinate;
}

const styles = cva(
  [
    "h-8 w-8",
    "border border-slate-400",
    "text-black text-2xl font-black",
    "grid place-items-center",
  ],
  {
    variants: {
      isBomb: {
        true: "",
      },
      active: {
        true: "bg-slate-300",
        false: [
          "bg-gray-300",
          "border-b-4 border-b-gray-500",
          "border-r-4 border-r-gray-500",
          "border-l-4 border-l-white",
          "border-t-4 border-t-white",
        ],
      },
      value: {
        "1": "text-blue-700",
        "2": "text-green-600",
        "3": "text-red-500",
        "4": "text-blue-900",
        "5": "text-red-900",
        "6": "text-teal-700",
        "7": "text-black",
        "8": "text-slate-100",
        bomb: "text-black",
      },
    },
    compoundVariants: [
      {
        active: true,
        isBomb: true,
        className: "bg-red-500",
      },
    ],
  }
);
export const Cell: FC<CellProps> = ({ active, value, ...props }) => {
  const isBomb = value === "bomb";

  return (
    <div
      className={twMerge(styles({ active, isBomb, value }))}
      onContextMenu={e => {
        e.preventDefault();
        console.log("Right click");
      }}
      {...props}
    >
      {active && (value === "bomb" ? "B" : value)}
    </div>
  );
};
