import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import fs from 'fs';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    // Service Worker 캐시 버전 자동 업데이트
    {
      name: 'sw-cache-version',
      buildStart() {
        const swPath = path.resolve(__dirname, 'public/sw.js');
        const timestamp = Date.now();
        let swContent = fs.readFileSync(swPath, 'utf-8');

        // 캐시 버전을 타임스탬프로 교체
        swContent = swContent.replace(
          /const CACHE_NAME = '[^']+';/,
          `const CACHE_NAME = 'running-handai-v${timestamp}';`
        );
        swContent = swContent.replace(
          /const STATIC_CACHE_NAME = '[^']+';/,
          `const STATIC_CACHE_NAME = 'static-v${timestamp}';`
        );

        fs.writeFileSync(swPath, swContent);
        console.log(`SW cache version updated to v${timestamp}`);
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_ROOT,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});