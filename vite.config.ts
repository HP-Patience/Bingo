import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
      },
      manifest: {
        name: 'Life Bingo',
        short_name: 'LifeBingo',
        start_url: '/',
        display: 'standalone',
        background_color: '#f9f9f9',
        theme_color: '#6f797a',
        icons: [
          {src: '/icon.png', sizes: '192x192', type: 'image/png'},
          {src: '/icon.png', sizes: '512x512', type: 'image/png'},
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    port: 5173,
    hmr: process.env.DISABLE_HMR !== 'true',
  },
});
