import { useEffect } from "react";
import { Grid } from "./playfield/Grid";
import { LogicalSize, appWindow } from "@tauri-apps/api/window";
import useResizeObserver from "use-resize-observer";

function App() {
  const { ref, width, height } = useResizeObserver<HTMLDivElement>();

  useEffect(() => {
    if (!width || !height) return;
    (async () => {
      appWindow.setSize(new LogicalSize(width, height + 30));
    })();
  }, [width, height]);

  return (
    <div className="grid place-items-center w-screen h-screen">
      <div ref={ref} className="w-fit h-fit">
        <Grid />
      </div>
    </div>
  );
}

export default App;
