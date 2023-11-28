import { LogicalSize, appWindow } from '@tauri-apps/api/window';
import { PropsWithChildren, useEffect } from 'react';
import useResizeObserver from 'use-resize-observer';
import { GameProvider } from './game/GameContext';
import { useGameState } from './game/useGameState';
import { SettingsProvider } from './settings/SettingsContext';
import { useSettings } from './settings/useSettings';
import { ConfigProvider, useConfig } from './utils/useConfig';

function Layout({ children }: PropsWithChildren) {
  const { isWeb } = useConfig();
  const { ref, width, height } = useResizeObserver<HTMLDivElement>();
  const settings = useSettings();
  const game = useGameState(settings);

  // Adjust window size based on app width / height
  useEffect(() => {
    if (isWeb) return;
    if (!width || !height) return;
    (async () => {
      appWindow.setSize(new LogicalSize(width, height + 28));
    })();
  }, [width, height, isWeb]);

  return (
    <SettingsProvider value={settings}>
      <GameProvider value={game}>
        <div ref={ref} className="w-fit h-fit">
          {children}
        </div>
      </GameProvider>
    </SettingsProvider>
  );
}

export function Root({ children }: PropsWithChildren) {
  const config = {
    isWeb: !window.__TAURI_METADATA__,
  };

  return (
    <ConfigProvider value={config}>
      <Layout>{children}</Layout>
    </ConfigProvider>
  );
}
