import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  height: 100dvh; /* 모바일에서 동적 뷰포트 높이 사용 */

  @supports not (height: 100dvh) {
    /* dvh를 지원하지 않는 브라우저를 위한 fallback */
    height: 100vh;
  }
`;
