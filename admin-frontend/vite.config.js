import path from 'path';
import checker from 'vite-plugin-checker';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// ----------------------------------------------------------------------

const PORT = 3031;

export default defineConfig({
  plugins: [
    react(),
    checker({
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
        dev: { logLevel: ['error'] },
      },
      overlay: {
        position: 'tl',
        initialIsOpen: false,
      },
    }),
  ],
  server: {
    port: PORT,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:34722', // 你的后端地址
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''), // 可选：去掉 /api 前缀
      },
    },
  },
  resolve: {
    alias: [
      {
        find: /^src(.+)/,
        replacement: path.resolve(process.cwd(), 'src/$1'),
      },
    ],
  },
  preview: { port: PORT, host: true },
});
