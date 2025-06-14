export const theme = {
  typography: {
    // Titles
    title1: {
      fontSize: '1.75rem', // 28px
      fontWeight: 600, // SemiBold
      lineHeight: 1.5, // 150%
    },
    title2: {
      fontSize: '1.5rem', // 24px
      fontWeight: 600, // SemiBold
      lineHeight: 1.5, // 150%
    },

    // Subtitles
    subtitle1: {
      fontSize: '1.25rem', // 20px
      fontWeight: 600, // SemiBold
      lineHeight: 1.5, // 150%
    },
    subtitle2: {
      fontSize: '1.125rem', // 18px
      fontWeight: 600, // SemiBold
      lineHeight: 1.5, // 150%
    },
    subtitle3: {
      fontSize: '1rem', // 16px
      fontWeight: 600, // SemiBold
      lineHeight: 1.5, // 150%
    },

    // Body text
    body1: {
      fontSize: '1rem', // 16px
      fontWeight: 400, // Regular
      lineHeight: 1.5, // 150%
    },
    body2: {
      fontSize: '0.875rem', // 14px
      fontWeight: 400, // Regular
      lineHeight: 1.5, // 150%
    },

    // Captions
    caption1: {
      fontSize: '0.875rem', // 14px
      fontWeight: 600, // SemiBold
      lineHeight: 1.5, // 150%
    },
    caption2: {
      fontSize: '0.8125rem', // 13px
      fontWeight: 600, // SemiBold
      lineHeight: 1.2, // 120%
    },
  },

  breakpoints: {
    mobile: '600px',
  },
} as const;

export type Theme = typeof theme;
