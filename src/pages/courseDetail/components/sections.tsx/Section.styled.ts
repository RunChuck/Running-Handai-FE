import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

export const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-16);
  padding: var(--spacing-24) var(--spacing-16);
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-12);
`;

export const SectionTitle = styled.span`
  ${theme.typography.subtitle2};
  color: var(--text-text-title, #1c1c1c);
`;

export const ButtonText = styled.span`
  ${theme.typography.body2};
  color: var(--text-text-title, #1c1c1c);
`;
