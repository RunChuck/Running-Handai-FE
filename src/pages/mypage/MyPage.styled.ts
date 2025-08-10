import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

export const Container = styled.div`
  width: 100%;
  height: 100%;
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

export const LoginButton = styled.button`
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