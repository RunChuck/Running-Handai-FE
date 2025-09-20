import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initKakao } from './utils/kakao';
import App from './App.tsx';

// 카카오 SDK 초기화
initKakao();

// 프로덕션 환경에서만 서비스 워커 등록
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
