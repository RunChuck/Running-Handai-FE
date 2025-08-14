import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initKakao } from './utils/kakao';
import App from './App.tsx';

// 카카오 SDK 초기화
initKakao();

// 프로덕션 환경에서만 서비스 워커 등록
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
