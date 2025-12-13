import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/pocketreporter2/' : '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['templates.json', 'favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Pocket Reporter',
        short_name: 'Reporter',
        description: 'Offline-first reporting tool for journalists',
        theme_color: '#4CAF50',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        runtimeCaching: [{
          urlPattern: ({ url }) => url.pathname.includes('templates.json'),
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'templates-cache',
            expiration: {
              maxEntries: 1,
              maxAgeSeconds: 60 * 60 * 24 * 30 // 30 Days
            }
          }
        }]
      }
    })
  ]
}));
