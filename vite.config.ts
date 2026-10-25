import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],

  server: {
    proxy: {
      '/api': {
        target: 'http://176.108.244.208:10000',
        changeOrigin: true,
      },
    },
  },
});