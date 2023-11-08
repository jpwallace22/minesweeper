import { cva } from "class-variance-authority";
import { FaceButton } from "./FaceButton";

const styles = cva([
  "flex justify-between items-center",
  "bg-gray-300",
  "border-4",
  "p-1.5",
  "border-t-gray-500 border-l-gray-500 border-b-white border-r-white",
]);
export const ScoreBar = () => {
  return (
    <div className="bg-gray-300 px-2 pt-2">
      <div className={styles()}>
        <div></div>
        <FaceButton />
        <div></div>
      </div>
    </div>
  );
};
