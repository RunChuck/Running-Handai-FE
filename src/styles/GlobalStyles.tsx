import { Global, css } from '@emotion/react';

export const GlobalStyles = () => (
  <Global
    styles={css`
      /* CSS 변수 정의 */
      :root {
        /* Spacing */
        --spacing-4: 0.25rem; /* 4px */
        --spacing-8: 0.5rem; /* 8px */
        --spacing-16: 1rem; /* 16px */
        --spacing-24: 1.5rem; /* 24px */
        --spacing-32: 2rem; /* 32px */
        --spacing-40: 2.5rem; /* 40px */
        --spacing-64: 4rem; /* 64px */
        --spacing-96: 6rem; /* 96px */
        --spacing-120: 7.5rem; /* 120px */

        /* Brand Color */
        --primary-primary: #4561ff;

        /* Text Colors */
        --text-text-primary: #4561ff;
        --text-text-title: #1c1c1c;
        --text-text-secondary: #555555;
        --text-text-disabled: #bbbbbb;
        --text-text-link: #0057ff;
        --text-text-error: #ff0010;
        --text-text-success: #00bf6a;
        --text-text-info: #ffcb00;
        --text-text-inverse: #ffffff;

        /* Surface Colors */
        --surface-surface-default: #ffffff;
        --surface-surface-highlight: #f4f4f4;
        --surface-surface-highlight2: #eeeeee;
        --surface-surface-highlight3: #f7f8fa;

        /* Line Colors */
        --line-line-001: #eeeeee;
        --line-line-002: #e0e0e0;
        --line-line-003: #1c1c1c;

        /* Background Colors */
        --bg-background-primary: #ffffff;
        --bg-background-secondary: #f4f4f4;
        --bg-background-tertiary: #eeeeee;
        --bg-background-inverse: #1c1c1c;

        /* System Colors */
        --system-error: #ff0010;
        --system-error-light: #ffe6e8;
        --system-warning: #ffcb00;
        --system-warning-light: #fff8e1;
        --system-success: #00bf6a;
        --system-success-light: #e6f9f2;
        --system-info: #0057ff;
        --system-info-light: #e6f0ff;

        /* Shadow */
        --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1),
          0 2px 4px -2px rgb(0 0 0 / 0.1);
        --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1),
          0 4px 6px -4px rgb(0 0 0 / 0.1);
      }

      /* Reset & Base Styles */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      html {
        height: 100%;
        font-size: 16px;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }

      body {
        height: 100%;
        font-family: 'Pretendard Variable', -apple-system, BlinkMacSystemFont,
          system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo',
          'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji',
          'Segoe UI Symbol', sans-serif;
        font-weight: 400;
        line-height: 1.5;
        color: var(--text-text-title);
        background-color: var(--surface-surface-default);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        -webkit-tap-highlight-color: transparent;
        /* 모바일 환경에서 스크롤 바운스 방지 */
        overscroll-behavior: none;
      }

      #root {
        height: 100%;
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        position: relative;
        /* 웹에서 볼 때 경계선 */
        @media (min-width: 601px) {
          box-shadow: var(--shadow-lg);
        }
      }

      /* 웹앱 느낌을 위한 스크롤바 스타일링 */
      ::-webkit-scrollbar {
        width: 4px;
      }

      ::-webkit-scrollbar-track {
        background: transparent;
      }

      ::-webkit-scrollbar-thumb {
        background: var(--line-line002);
        border-radius: 2px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: var(--text-text-secondary);
      }

      /* 링크 스타일 */
      a {
        color: var(--text-text-link);
        text-decoration: none;

        &:hover {
          color: var(--brand-primary-hover);
        }
      }

      /* 버튼 기본 스타일 */
      button {
        font-family: inherit;
        cursor: pointer;
        border: none;
        background: none;
        outline: none;

        &:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
      }

      /* 입력 필드 기본 스타일 */
      input,
      textarea,
      select {
        font-family: inherit;
        font-size: inherit;
        outline: none;

        &::placeholder {
          color: var(--text-text-disabled);
        }
      }

      /* 이미지 기본 스타일 */
      img {
        max-width: 100%;
        height: auto;
        display: block;
      }

      /* 모바일 터치 환경 최적화 */
      @media (max-width: 600px) {
        body {
          /* iOS Safari에서 주소창 숨김 처리 */
          height: 100vh;
          height: 100dvh;
        }

        #root {
          height: 100vh;
          height: 100dvh;
        }
      }
    `}
  />
);

export default GlobalStyles;
