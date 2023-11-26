import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  build: {
    outDir: 'lib',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'minesweeper',
      fileName: 'minesweeper',
    },
  },
  plugins: [dts({ rollupTypes: true })],
}));
