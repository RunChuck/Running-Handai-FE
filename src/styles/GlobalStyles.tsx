import { Global, css } from '@emotion/react';

export const GlobalStyles = () => (
  <Global
    styles={css`
      @import url('https://fonts.googleapis.com/css2?family=Carter+One&family=Jersey+15&family=Noto+Sans+KR:wght@100..900&display=swap');

      @font-face {
        font-family: 'HakgyoansimAllimjang';
        src: url('/src/assets/fonts/Hakgyoansim Allimjang TTF R.ttf') format('truetype');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }

      /* CSS 변수 정의 */
      :root {
        /* Spacing */
        --spacing-4: 0.25rem; /* 4px */
        --spacing-8: 0.5rem; /* 8px */
        --spacing-12: 0.75rem; /* 12px */
        --spacing-16: 1rem; /* 16px */
        --spacing-24: 1.5rem; /* 24px */
        --spacing-32: 2rem; /* 32px */
        --spacing-40: 2.5rem; /* 40px */
        --spacing-64: 4rem; /* 64px */
        --spacing-96: 6rem; /* 96px */
        --spacing-120: 7.5rem; /* 120px */

        /* Brand Color */
        --primary-primary: #4561ff;
        --primary-primary002: #2845e9;
        --primary-primary003: #1b37d3;
        --secondary-default: #f4f4f4;
        --secondary-hover: #eeeeee;
        --secondary-active: #e4e4e4;

        /* GrayScale */
        --GrayScale-gray900: #1c1c1c;
        --GrayScale-gray800: #333333;
        --GrayScale-gray700: #555555;
        --GrayScale-gray600: #777777;
        --GrayScale-gray500: #999999;
        --GrayScale-gray400: #bbbbbb;
        --GrayScale-gray300: #e0e0e0;
        --GrayScale-gray200: #eeeeee;
        --GrayScale-gray100: #f4f4f4;
        --GrayScale-gray050: #fafafa;

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
        --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
      }

      /* Reset & Base Styles */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      html,
      body {
        margin: 0;
        padding: 0;
        overscroll-behavior: none;
        overflow-y: auto;
        overflow-x: hidden;
        width: 100%;
        height: 100%;
        touch-action: pan-y;
      }

      html {
        height: 100%;
        font-size: 16px;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: var(--surface-surface-highlight, #f4f4f4);
      }

      body {
        height: 100%;
        font-family:
          'Pretendard Variable',
          -apple-system,
          BlinkMacSystemFont,
          system-ui,
          Roboto,
          'Helvetica Neue',
          'Segoe UI',
          'Apple SD Gothic Neo',
          'Noto Sans KR',
          'Malgun Gothic',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          sans-serif;
        font-weight: 400;
        line-height: 1.5;
        color: var(--text-text-title);
        background-color: var(--GrayScale-gray050, #fafafa);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        -webkit-tap-highlight-color: transparent;
        /* 모바일 환경에서 스크롤 바운스 방지 */
        overscroll-behavior: none;
      }

      #root {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        position: relative;
        background-color: var(--surface-surface-default, #ffffff);
        min-height: 100vh; /* 모바일과 웹 모두 min-height 사용 */

        @media (min-width: 601px) {
          box-shadow: var(--shadow-lg);
        }

        /* 모바일에서 추가 최적화 */
        @media (max-width: 600px) {
          min-height: 100dvh; /* 동적 뷰포트 높이 사용 */
        }
      }

      /* 스크롤바 스타일링 - 데스크톱에서만 표시 */
      @media (min-width: 601px) {
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-thumb {
          background: var(--GrayScale-gray400, #bbbbbb);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: var(--GrayScale-gray500, #999999);
        }
      }

      /* 모바일에서는 스크롤바 숨기기 */
      @media (max-width: 600px) {
        ::-webkit-scrollbar {
          display: none;
        }
      }

      /* 링크 스타일 */
      a {
        color: var(--text-text-link);
        text-decoration: none;

        &:hover {
          color: var(--text-text-primary);
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
          cursor: default;
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
    `}
  />
);

export default GlobalStyles;
