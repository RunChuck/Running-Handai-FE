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

    // Body text
    body1: createTypography('1rem', 400, 1.5), // 16px, Regular, 150%
    body2: createTypography('0.875rem', 400, 1.5), // 14px, Regular, 150%

    // Captions
    caption1: createTypography('0.875rem', 600, 1.5), // 14px, SemiBold, 150%
    caption2: createTypography('0.8125rem', 600, 1.2), // 13px, SemiBold, 120%
  },

  breakpoints: {
    mobile: '600px',
  },
} as const;

export type Theme = typeof theme;
