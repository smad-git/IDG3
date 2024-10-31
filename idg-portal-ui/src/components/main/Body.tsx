import React from 'react';
import { Box } from '@mui/material';

export interface BodyProps {
  children?: React.ReactNode
  className?: string;
}

const Body: React.FC<BodyProps> = ({ className, children }) => {
  return (
    <Box
      component="main"
      className={className}
      sx={{
        width: '100%',
        maxWidth: {
          xs: '100%',
          sm: '600px',
          md: '960px',
          lg: '1440px',
          xl: '1920px',
        },
        margin: '0 auto',
        padding: '16px',
        paddingTop: '64px',
        flexGrow: 1,
      }}
    >
      {children}
    </Box>
  );
};

export default Body;
