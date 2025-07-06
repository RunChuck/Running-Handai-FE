import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
export const Container = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
`;

export const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

export const CourseGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 12px;

  @media (min-width: 600px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

export const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-40);
`;

export const StatusText = styled.div`
  ${theme.typography.body1}
  color: var(--text-text-secondary, #555555);
  text-align: center;
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-16);
  padding: var(--spacing-40);
`;

export const RetryButton = styled.button`
  ${theme.typography.subtitle3}
  background: var(--primary-primary, #4561ff);
  color: var(--text-text-inverse, #ffffff);
  border: none;
  border-radius: 4px;
  padding: var(--spacing-8) var(--spacing-16);
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
