import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        VitePWA({
           strategies: 'injectManifest',
           srcDir: 'src',
           filename: 'sw.js',
           registerType: 'autoUpdate',
           includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
           injectManifest: {
             maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
           },
           manifest: {
             name: 'Ediflow',
             short_name: 'Ediflow',
             description: 'Gestión inteligente para tu comunidad',
             theme_color: '#00AEEF',
             background_color: '#0A0A0A',
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
           }
        })
      ],
      build: {
        outDir: 'dist',
        emptyOutDir: true,
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
