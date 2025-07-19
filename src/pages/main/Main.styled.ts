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

export const StatusText = styled.div`
  ${theme.typography.body2}
  color: var(--text-text-secondary, #555555);
  text-align: center;
  white-space: pre-line;
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
