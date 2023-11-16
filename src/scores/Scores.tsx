import { useEffect } from 'react';
import { capitalizeFirstLetter } from '../utils/common';
import { useTauriStore } from '../utils/useTauriStore';
import useResizeObserver from 'use-resize-observer';
import { LogicalSize, appWindow } from '@tauri-apps/api/window';

export const Scores = () => {
  const { ref, width, height } = useResizeObserver<HTMLDivElement>();
  const [allScores] = useTauriStore('scores');
  console.log('🔍 ~ Scores ~ allScores:', allScores);

  const scoreCount = Array.from({ length: 3 });

  useEffect(() => {
    if (!width || !height) return;
    (async () => {
      appWindow.setSize(new LogicalSize(width + 16, height + 44));
    })();
  }, [width, height]);

  return (
    <div ref={ref} className="p-2 bg-gray-200 h-fit w-fit mb-4">
      <h1 className="px-8 py-4 text-2xl border-topDark-lg whitespace-nowrap mb-2 font-bold">
        🎊 High Scores 🎊
      </h1>
      <div className="border-topDark-lg">
        {Object.entries(allScores)
        .map(([difficulty, scores]) => (
          <div key={difficulty} className="p-2">
            <h4 className="font-semibold text-lg">
              {capitalizeFirstLetter(difficulty)}
            </h4>
            <ol>
              {scoreCount.map((_, i) => (
                <li key={i} className="flex gap-1 pl-2">
                  <div>{i + 1}.</div>
                  <div>{scores[i]}</div>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
};
