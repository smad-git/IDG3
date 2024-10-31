import { createTheme } from '@mui/material/styles';

export const LIGHT_THEME = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
    text: {
      footerText: '#ffffff',
    }
  },
  components: {
    MuiToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1976d2',
          color: '#ffffff',
        },
      },
    },
  },
});

export const DARK_THEME = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1e1e1e',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      footerText: '#ffffff',
    },
  },
  components: {
    MuiToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          color: '#ffffff',
        },
      },
    },
  },
});

export const BLUE_THEME = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
    },
    background: {
      default: '#e3f2fd',
      paper: '#ffffff',
    },
    text: {
      footerText: '#ffffff',
    },
  },
  components: {
    MuiToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: '#2196f3',
          color: '#ffffff',
        },
      },
    },
  },
});

export const GREEN_THEME = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4caf50',
    },
    background: {
      default: '#e8f5e9',
      paper: '#ffffff',
    },
    text: {
      footerText: '#000000',
    },
  },
  components: {
    MuiToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: '#4caf50',
          color: '#000000',
        },
      },
    },
  },
});
