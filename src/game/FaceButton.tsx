import { cva } from 'class-variance-authority';
import { useEffect, useState } from 'react';
import { useSettingsContext } from '../settings/SettingsContext';
import { getGridData } from '../utils/getGridData';
import { useGameContext } from './GameContext';
import { GameState } from './useGameState';

const styles = cva([
  'font-mono',
  '!leading-8',
  'text-3xl',
  'bg-gray-300',
  'border-topLight-lg',
  'active:border-t-gray-200 active:border-l-gray-200 active:border-r-gray-400 active:border-b-gray-400',
  'active:border-2 active:p-0.5 active:scale-90',
  'w-10',
  'h-10',
]);

export const FaceButton = () => {
  const { finished, setGameState } = useGameContext();
  const settings = useSettingsContext();
  const [pressed, setPressed] = useState(false);

  const onReset = () => {
    setGameState({
      type: 'RESET_GAME',
      payload: getGridData(settings).minefield,
    });
  };

  useEffect(() => {
    document.addEventListener('mousedown', () => setPressed(true));
    document.addEventListener('mouseup', () => setPressed(false));
    return () => {
      document.removeEventListener('mousedown', () => setPressed(true));
      document.removeEventListener('mouseup', () => setPressed(false));
    };
  });

  return (
    <button className={styles()} onClick={onReset}>
      {!!finished ? getFinishedFace(finished) : getGameFace(pressed)}
    </button>
  );
};

const getGameFace = (shocked: boolean) => (shocked ? '😮' : '🙂');
const getFinishedFace = (finished: GameState['finished']) =>
  finished === 'win' ? '🥳' : '😵';
