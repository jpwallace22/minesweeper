import { cva } from 'class-variance-authority';
import { useSettingsContext } from '../settings/SettingsContext';
import { DigitalNumberDisplay } from './DigitalNumberDisplay';
import { FaceButton } from './FaceButton';
import { useGameContext } from './GameContext';
import { GRID_DATA } from '../constants';

const styles = cva([
  'flex justify-between items-center',
  'bg-gray-300',
  'p-1.5',
  'border-topDark-lg',
]);
export const ScoreBar = () => {
  const { difficulty } = useSettingsContext();
  const [{ flaggedCells, time }] = useGameContext();
  const { bombCount } = GRID_DATA[difficulty];

  return (
    <div className="bg-gray-300 px-2 pt-2">
      <div className={styles()}>
        <DigitalNumberDisplay number={bombCount - flaggedCells.size} />
        <FaceButton />
        <DigitalNumberDisplay number={time} />
      </div>
    </div>
  );
};
