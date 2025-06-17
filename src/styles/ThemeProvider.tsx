import type { ReactNode } from 'react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { theme } from './theme';
import GlobalStyles from './GlobalStyles';

interface ThemeProviderProps {
  children: ReactNode;
}

const muiTheme = createTheme();

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <MuiThemeProvider theme={muiTheme}>
      <EmotionThemeProvider theme={theme}>
        <GlobalStyles />
        {children}
      </EmotionThemeProvider>
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
