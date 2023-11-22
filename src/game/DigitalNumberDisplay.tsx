import { cva } from 'class-variance-authority';

const styles = cva([
  'font-mono text-5xl font-bold',
  'cursor-default',
  'text-red-600',
  'bg-gray-900',
  'relative',
  'px-1',
  'h-12',
  'grid place-items-center',
  'border-topDark-sm',
]);

export const DigitalNumberDisplay = ({ number }: { number: number }) => {
  return (
    <div className={styles()}>
      <div className="absolute opacity-25">888</div>
      <div className="absolute red-text-glow">{formatForGameClock(number)}</div>
      <div className="opacity-0">888</div>
    </div>
  );
};

const formatForGameClock = (num: number) => {
  if (num > 999) {
    num = 999;
  }

  var s = '000' + num;
  return s.substring(s.length - 3);
};
