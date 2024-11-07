import { css } from '@mui/system';

const LIGHT_THEME_GREYS = {
    grey: "#B0BEC5",          // Light grey for the light theme
    darkerGrey: "#607D8B",     // Darker grey for contrast
  };
  
  const DARK_THEME_GREYS = {
    grey: "#757575",          // Standard grey for dark theme
    darkerGrey: "#424242",     // Darker grey for deeper contrasts
  };
  
  const BLUE_THEME_GREYS = {
    grey: "#90CAF9",          // Light greyish blue
    darkerGrey: "#42A5F5",     // Deeper greyish blue, for contrast
  };
  
  const GREEN_THEME_GREYS = {
    grey: "#A5D6A7",          // Light green-grey
    darkerGrey: "#388E3C",     // Darker green-grey for deeper tones
  };

  export const grayShades = (theme) => ({
    lightGrey: theme.palette.mode === 'light' ? LIGHT_THEME_GREYS.grey : DARK_THEME_GREYS.grey,
    darkGrey: theme.palette.mode === 'dark' ? LIGHT_THEME_GREYS.darkerGrey : DARK_THEME_GREYS.darkerGrey,
  });

export const globalScrollbarStyles = (theme) => css`
  ::-webkit-scrollbar {
    width: 8px; /* Vertical scrollbar width */
    height: 8px; /* Horizontal scrollbar height */
  }

  /* Style the thumb (handle) of the scrollbar */
  ::-webkit-scrollbar-thumb {
    background-color: ${theme.palette.primary.main}; /* MUI primary color */
    border-radius: 10px; /* Rounded corners */
    border: 2px solid ${theme.palette.background.paper}; /* Optional border around the thumb */
  }

  /* Hover state for scrollbar thumb */
  ::-webkit-scrollbar-thumb:hover {
    background-color: ${theme.palette.primary.dark}; /* Darker shade for hover */
  }

  /* Active state for scrollbar thumb */
  ::-webkit-scrollbar-thumb:active {
    background-color: ${theme.palette.primary.light}; /* Lighter shade for active state */
  }

  /* Style the track (background) of the scrollbar */
  ::-webkit-scrollbar-track {
    background-color: ${theme.palette.background.default}; /* MUI background color */
    border-radius: 10px;
  }

  /* Style the corner (where horizontal and vertical scrollbars meet) */
  ::-webkit-scrollbar-corner {
    background-color: ${theme.palette.background.paper};
  }

  /* For Firefox */
  scrollbar-width: thin;
  scrollbar-color: ${theme.palette.primary.main} ${theme.palette.background.default};

  /* Optional: Horizontal scrollbar styling */
  ::-webkit-scrollbar-horizontal {
    height: 10px; /* Specific height for horizontal scrollbar */
  }
`;
