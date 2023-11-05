import { cva } from "class-variance-authority";
import { ComponentPropsWithoutRef, FC, MouseEvent, useRef } from "react";
import { twMerge } from "tailwind-merge";
import Icon from "./Icons";
import { CellValue, Coordinate } from "./playfield";

interface CellProps extends Omit<ComponentPropsWithoutRef<"button">, "value"> {
  active: boolean;
  flagged: boolean;
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
        true: "bg-gray-300",
        false: [
          "bg-gray-400",
          "border-b-4 border-b-gray-500",
          "border-r-4 border-r-gray-500",
          "border-l-4 border-l-white",
          "border-t-4 border-t-white",
          "cursor-pointer",
        ],
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
export const Cell: FC<CellProps> = ({ active, value, flagged, ...props }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const isBomb = value === "bomb";

  const onMouseDown = (e: MouseEvent) => {
    if (e.button === 0 && !flagged && !isBomb) {
      ref.current?.classList.add("pressed");
    }
  };
  const onMouseUp = () => {
    ref.current?.classList.remove("pressed");
  };

  return (
    <button
      ref={ref}
      className={twMerge(styles({ active, isBomb }))}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseOut={onMouseUp}
      {...props}
    >
      {active && <Icon id={value} />}
      {flagged && <Icon id="flag" />}
    </button>
  );
};
