import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  publicDir: 'public',
  build: {
    outDir: 'dist',
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'icons.svg',
        'datamatang.txt',
        'data.txt',
        'datafilter.txt',
        'n2.txt',
        'n3.txt',
        'n4.txt',
        'n5.txt',
        'kanji_jlpt_only.json',
        'soal/*.json',
        'bunpou/**/*',
      ],
      workbox: {
        // Precache all static assets in dist/
        globPatterns: ['**/*.{js,css,html,svg,txt,json,jpg,png,webp,woff,woff2}'],
        // kanji_jlpt_only.json is ~1.1MB, raise limit from default 2MB to 5MB
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        // Runtime caching as fallback for dynamically fetched data
        runtimeCaching: [
          {
            urlPattern: /\/soal\/.*\.json$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'soal-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /\/bunpou\/.*$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'bunpou-cache',
              expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /\.(txt|json)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'data-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
      manifest: {
        name: 'FlashcardGW',
        short_name: 'FC-GW',
        description: 'Aplikasi Flashcard Jepang dengan algoritma FSRS',
        theme_color: '#07070b',
        background_color: '#07070b',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'favicon.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
});
