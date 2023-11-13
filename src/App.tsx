import { LogicalSize, WebviewWindow, appWindow } from '@tauri-apps/api/window';
import { useEffect } from 'react';
import useResizeObserver from 'use-resize-observer';
import { GameProvider } from './game/GameContext';
import { Grid } from './game/Grid';
import { ScoreBar } from './game/ScoreBar';
import { useGameState } from './game/useGameState';
import { SettingsProvider } from './settings/SettingsContext';
import { useSettings } from './settings/useSettings';
import { useListen } from './utils/useListen';

function App() {
  const { ref, width, height } = useResizeObserver<HTMLDivElement>();
  const settings = useSettings();
  const [gameState, setGameState] = useGameState(settings);

  // Listen for/create menu windows
  useListen('windows', ({ payload }: { payload: 'scores' }) => {
    if (payload === 'scores') {
      new WebviewWindow('scores', {
        url: '../high_scores.html',
        title: 'High Scores',
      });
    }
  });

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
