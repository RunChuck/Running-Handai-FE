import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
export const Container = styled.div`
  width: 100%;
  max-width: 600px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0 auto;
  overflow: hidden;
`;

export const MapContainer = styled.div<{ bottomSheetHeight: number }>`
  width: 100%;
  height: ${({ bottomSheetHeight }) => `calc(100% - ${bottomSheetHeight}px)`};
`;

export const CourseGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 12px;

  @media (min-width: 600px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-12);
`;

export const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--spacing-24) 0;
  gap: var(--spacing-12);

  img {
    margin: 0 auto;
  }
`;

export const StatusText = styled.div`
  ${theme.typography.body2}
  color: var(--text-text-secondary, #555555);
  text-align: center;
  white-space: pre-line;
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-12);
  padding: var(--spacing-24) 0;
`;

export const RetryButton = styled.button`
  ${theme.typography.subtitle3}
  background: var(--primary-primary, #4561ff);
  color: var(--text-text-inverse, #ffffff);
  border: none;
  border-radius: 4px;
  padding: var(--spacing-8) var(--spacing-16);
  margin-top: var(--spacing-12);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ThemeCourseCardContainer = styled.div`
  display: flex;
  gap: var(--spacing-8);
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  margin: 0 calc(-1 * var(--spacing-16));
  padding: 0 var(--spacing-16);
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ThemeCourseCard = styled.div`
  min-width: 164px;
  flex-shrink: 0;
  height: 66px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background: var(--surface-surface-highlight3, #f7f8fa);
  padding: var(--spacing-12) var(--spacing-24);
  margin-top: var(--spacing-12);
  cursor: pointer;
`;

export const ThemeCourseCardTitle = styled.span`
  ${theme.typography.caption1}
  color: var(--text-text-title, #1c1c1c);
`;

export const ThemeCourseCardText = styled.span`
  ${theme.typography.body2}
  color: var(--text-text-secondary, #555555);
`;
