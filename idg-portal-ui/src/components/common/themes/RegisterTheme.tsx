import {
  BLUE_THEME,
  DARK_THEME,
  GREEN_THEME,
  LIGHT_THEME,
} from './ThemeConfig';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { createTheme, ThemeOptions } from '@mui/material';

export type ThemeType = 'light' | 'dark' | 'blue' | 'green';

export const REGISTERED_THEMES: Record<
  string,
  { name: ThemeType, theme: ThemeOptions; icon: JSX.Element }
> = {
  dark: { name: 'dark', theme: DARK_THEME, icon: <DarkModeIcon /> },
  light: { name: 'light',theme: LIGHT_THEME, icon: <LightModeIcon /> },
  blue: {
    name: 'blue',
    theme: BLUE_THEME,
    icon: <ColorLensIcon style={{ color: '#2196f3' }} />,
  },
  green: {
    name: 'green',
    theme: GREEN_THEME,
    icon: <ColorLensIcon style={{ color: '#4caf50' }} />,
  },
};
