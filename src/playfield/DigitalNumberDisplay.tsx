import { cva } from 'class-variance-authority';

const styles = cva([
  'font-mono text-5xl font-bold',
  'text-red-600',
  'bg-gray-900',
  'relative',
  'px-1',
  'h-12',
  'grid place-items-center',
  'border-3 border-t-gray-500 border-l-gray-500 border-b-white border-r-white',
]);

export const DigitalNumberDisplay = ({ number }: { number: number }) => {
  return (
    <div className={styles()}>
      <div className="absolute opacity-25">888</div>
      <div className="absolute red-text-glow">{addLeadingZeros(number)}</div>
      <div className="opacity-0">888</div>
    </div>
  );
};

const addLeadingZeros = (num: number) => {
  var s = '000' + num;
  return s.substring(s.length - 3);
};
