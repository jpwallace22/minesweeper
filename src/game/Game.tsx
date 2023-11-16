import { LogicalSize, appWindow } from '@tauri-apps/api/window';
import { useEffect } from 'react';
import useResizeObserver from 'use-resize-observer';
import { SettingsProvider } from '../settings/SettingsContext';
import { useSettings } from '../settings/useSettings';
import { GameProvider } from './GameContext';
import { Grid } from './Grid';
import { ScoreBar } from './ScoreBar';
import { useGameState } from './useGameState';

function App() {
  const { ref, width, height } = useResizeObserver<HTMLDivElement>();
  const settings = useSettings();
  const [gameState, setGameState] = useGameState(settings);

  // Adjust window size based on app width / height
  useEffect(() => {
    if (!width || !height) return;
    (async () => {
      appWindow.setSize(new LogicalSize(width, height + 30));
    })();
  }, [width, height]);

  return (
    <SettingsProvider value={settings}>
      <GameProvider value={[gameState, setGameState]}>
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
