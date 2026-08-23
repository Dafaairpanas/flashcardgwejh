import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,json,mp3,wav}'],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB limit for JSON files
      },
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'AditFlashcard',
        short_name: 'AditFlashcard',
        description: 'Belajar kosakata dan kanji JLPT N5-N1 dengan sistem flashcard pintar',
        theme_color: '#0a0a0b',
        background_color: '#0a0a0b',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': '/src',
    }
  }
});
