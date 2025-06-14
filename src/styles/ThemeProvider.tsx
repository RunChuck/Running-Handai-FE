import type { ReactNode } from 'react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { theme } from './theme';
import GlobalStyles from './GlobalStyles';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <EmotionThemeProvider theme={theme}>
      <GlobalStyles />
      {children}
    </EmotionThemeProvider>
  );
};

export default ThemeProvider;
