// LandingPageLayout.tsx
import React from 'react';
import { Box } from '@mui/material';
import Footer from '../main/Footer';
import { ThemeContextProvider } from '../contexts/ThemeContext';
import Header, { HeaderProps } from '../main/Header';
import Body, { BodyProps } from '../main/Body';

interface IdgHomeLayoutProps {
  children?: React.ReactNode;
  headerProps?: HeaderProps;
  bodyProps?: BodyProps;
}

const IdgHomeLayout: React.FC<IdgHomeLayoutProps> = ({headerProps, bodyProps, children},{
  
}) => {
  return (
    <ThemeContextProvider>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        <Header {...headerProps}/>
        <Body {...bodyProps}>{children}</Body>
        <Footer />
      </Box>
    </ThemeContextProvider>
  );
};

export default IdgHomeLayout;
