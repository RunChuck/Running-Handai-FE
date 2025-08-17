const createTypography = (fontSize: string, fontWeight: number, lineHeight: number) => `
  font-size: ${fontSize};
  font-weight: ${fontWeight};
  line-height: ${lineHeight};
`;

export const theme = {
  typography: {
    // Titles
    title1: createTypography('1.75rem', 600, 1.5), // 28px, SemiBold, 150%
    title2: createTypography('1.5rem', 600, 1.5), // 24px, SemiBold, 150%

    // Subtitles
    subtitle1: createTypography('1.25rem', 600, 1.5), // 20px, SemiBold, 150%
    subtitle2: createTypography('1.125rem', 600, 1.5), // 18px, SemiBold, 150%
    subtitle3: createTypography('1rem', 600, 1.5), // 16px, SemiBold, 150%
    subtitle4: createTypography('1.125rem', 400, 1.5), // 18px, Regular, 150%

    // Body text
    body1: createTypography('1rem', 400, 1.5), // 16px, Regular, 150%
    body2: createTypography('0.875rem', 400, 1.5), // 14px, Regular, 150%

    // Captions
    caption1: createTypography('0.875rem', 600, 1.5), // 14px, SemiBold, 150%
    caption2: createTypography('0.8125rem', 600, 1.2), // 13px, SemiBold, 120%
    caption3: createTypography('0.8125rem', 400, 1.2), // 13px, Regular, 120%

    // Labels
    label1: createTypography('0.75rem', 600, 1.2), // 12px, SemiBold, 120%
    label2: createTypography('0.75rem', 400, 1.2), // 12px, Regular, 120%
    label3: createTypography('0.75rem', 500, 1.2), // 12px, Medium, 120%

    // Modal
    modalContent: createTypography('1.125rem', 400, 1.5), // 18px, Regular, 150%
  },

  breakpoints: {
    mobile: '600px',
  },
} as const;

export type Theme = typeof theme;
