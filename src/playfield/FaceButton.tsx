import { cva } from "class-variance-authority";
import { useEffect, useState } from "react";
import { useGameContext } from "./GameContext";
import { GameState } from "./useGameState";

const styles = cva([
  "text-3xl",
  "bg-gray-300",
  "border-4",
  "border-t-white border-l-white border-r-gray-500 border-b-gray-500",
  "active:border-t-gray-200 active:border-l-gray-200 active:border-r-gray-400 active:border-b-gray-400",
  "active:border-2 active:p-0.5 active:scale-90",
  "w-10",
  "h-10",
  "grid",
  "place-items-center",
]);

export const FaceButton = () => {
  const [{ finished }, dispatch] = useGameContext();
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    document.addEventListener("mousedown", () => setPressed(true));
    document.addEventListener("mouseup", () => setPressed(false));
    return () => {
      document.removeEventListener("mousedown", () => setPressed(true));
      document.removeEventListener("mouseup", () => setPressed(false));
    };
  });

  return (
    <button
      className={styles()}
      onClick={() => dispatch({ type: "RESET_GAME" })}
    >
      {!!finished ? getFinishedFace(finished) : getGameFace(pressed)}
    </button>
  );
};

const getGameFace = (shocked: boolean) => (shocked ? "😮" : "🙂");
const getFinishedFace = (finished: GameState["finished"]) =>
  finished === "win" ? "🥳" : "😵";
