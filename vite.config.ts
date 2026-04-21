import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  base: './', // Use relative paths for assets (required for Chrome extensions)
  css: {
    preprocessorOptions: {
      scss: {
        // Suppress deprecation warnings for @import (required for Tailwind compatibility)
        silenceDeprecations: ['import'],
      },
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        // Don't hash filenames for easier debugging
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  server: {
    port: 3000,
  },
});
