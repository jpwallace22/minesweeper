import { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config: Config = {
  content: ['./src/**/*.{html,ts,tsx,js,jsx}'],
  theme: {
    extend: {
      borderWidth: {
        '3': '3px',
      },
      fontFamily: {
        mono: ['Digital', ...fontFamily.mono],
      },
    },
  },
  plugins: [],
};

export default config;
