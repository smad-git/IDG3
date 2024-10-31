import React, { createContext, useMemo, useState, useContext, ReactNode } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { REGISTERED_THEMES, ThemeType } from '../common/themes/RegisterTheme';

interface ThemeContextProps {
  currentTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  currentTheme: 'light',
  setTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

interface ThemeContextProviderProps {
  children: ReactNode;
}

export const ThemeContextProvider: React.FC<ThemeContextProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeType || 'light';
    return savedTheme;
  });

  const setTheme = (theme: ThemeType) => {
    setCurrentTheme(theme);
  };

  const theme = useMemo(() => createTheme(REGISTERED_THEMES[currentTheme].theme), [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
