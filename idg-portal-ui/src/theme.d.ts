import { Theme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypeBackground {
    footer?: string;
  }
  interface TypeText {
    footerText?: string;
  }
}

import { ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    iconBackgrounds: {
      light: string;
      dark: string;
      blue: string;
      green: string;
    };
  }
  interface ThemeOptions {
    iconBackgrounds?: {
      light?: string;
      dark?: string;
      blue?: string;
      green?: string;
    };
  }
}