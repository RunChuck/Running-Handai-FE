import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import { initKakao } from './utils/kakao';
import App from './App.tsx';

// 카카오 SDK 초기화
initKakao();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
