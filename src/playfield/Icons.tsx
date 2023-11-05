import { ComponentPropsWithoutRef, FC } from "react";
import { NumberValues } from "./playfield";

type MineFieldIcons = "flag" | "bomb" | NumberValues;

interface IconProps extends Omit<ComponentPropsWithoutRef<"svg">, "id"> {
  id?: MineFieldIcons | null;
  size?: number;
}

export const Icon: FC<IconProps> = ({
  id,
  className,
  fill,
  stroke,
  size,
  ...props
}) =>
  id ? (
    <svg
      width={size || 24}
      height={size || 24}
      role="img"
      aria-label={id}
      {...props}
    >
      <use href={`/sprite.svg#${id}`} />
    </svg>
  ) : null;

export default Icon;
