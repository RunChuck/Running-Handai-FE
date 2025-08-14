import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  padding-bottom: 32px;
`;

export const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 16px 0 16px;
  gap: 12px;
`;

export const SectionContainer2 = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  gap: 12px;
`;

export const SectionTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SectionTitle = styled.div`
  ${theme.typography.subtitle3};
  color: var(--text-text-title, #1c1c1c);
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const MoreButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  ${theme.typography.caption1};
  color: var(--text-text-secondary, #555555);
  cursor: pointer;

  &:hover {
    color: var(--GrayScale-gray600, #777777);
  }
`;

export const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
  gap: 4px;
  align-self: stretch;
  border-radius: 4px;
  background: var(--surface-surface-highlight3, #f7f8fa);
`;

export const ContentDescription = styled.span`
  ${theme.typography.body2};
  color: var(--text-text-secondary, #555555);
`;

export const CtaButton = styled.button`
  ${theme.typography.caption1};
  color: var(--text-text-title, #1c1c1c);
  text-decoration-line: underline;
  cursor: pointer;
`;

export const SectionDivider = styled.div`
  width: 100%;
  height: 10px;
  background-color: var(--surface-surface-highlight, #f4f4f4);
`;

export const CardList = styled.div`
  display: flex;
  gap: var(--spacing-12);
  overflow-x: auto;
  padding: 2px;

  /* 터치 스크롤  */
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  touch-action: pan-x;

  /* 드래그 시 선택 방지 */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;

  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;
