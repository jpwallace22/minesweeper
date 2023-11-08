import { LogicalSize, appWindow } from "@tauri-apps/api/window";
import { useEffect } from "react";
import useResizeObserver from "use-resize-observer";
import { Grid } from "./playfield/Grid";
import { ScoreBar } from "./playfield/ScoreBar";
import { useGameState } from "./playfield/useGameState";
import { SettingsProvider } from "./settings/SettingsContext";
import { useSettings } from "./settings/useSettings";
import { GameProvider } from "./playfield/GameContext";

function App() {
  const { ref, width, height } = useResizeObserver<HTMLDivElement>();
  const gameState = useGameState();
  const settings = useSettings();

  useEffect(() => {
    if (!width || !height) return;
    (async () => {
      appWindow.setSize(new LogicalSize(width, height + 30));
    })();
  }, [width, height]);

  return (
    <SettingsProvider value={settings}>
      <GameProvider value={gameState}>
        <div className="grid place-items-center w-screen h-screen">
          <div ref={ref} className="w-fit h-fit">
            <ScoreBar />
            <Grid />
          </div>
        </div>
      </GameProvider>
    </SettingsProvider>
  );
}

export default App;
