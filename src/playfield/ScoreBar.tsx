import { cva } from 'class-variance-authority';
import { useSettingsContext } from '../settings/SettingsContext';
import { DigitalNumberDisplay } from './DigitalNumberDisplay';
import { FaceButton } from './FaceButton';
import { useGameContext } from './GameContext';

const styles = cva([
  'flex justify-between items-center',
  'bg-gray-300',
  'border-4',
  'p-1.5',
  'border-t-gray-500 border-l-gray-500 border-b-white border-r-white',
]);
export const ScoreBar = () => {
  const { bombCount } = useSettingsContext();
  const [{ flaggedCells, time }] = useGameContext();

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
