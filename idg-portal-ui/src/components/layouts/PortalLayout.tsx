// LandingPageLayout.tsx
import React, { useState } from 'react';
import { Box } from '@mui/material';
import Footer from '../main/Footer';
import { ThemeContextProvider } from '../contexts/ThemeContext';
import Header from '../main/Header';
import Body from '../main/Body';
import PortalBodyLayout, { DrawerItem } from './PortalBodyLayout';

export interface PortalLayoutProps {
  children: React.ReactNode;
  drawerConfig: DrawerItem[];
  headerText: string;
}

const PortalLayout: React.FC<PortalLayoutProps> = ({
  children,
  drawerConfig,
  headerText
}) => {

  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  return (
    <ThemeContextProvider>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        <Header showLogoutBtn={true} toggleDrawer={toggleDrawer} text={headerText}/>
        <Body>
          <PortalBodyLayout drawerConfig={drawerConfig} children={children} toggleDrawer={toggleDrawer} openDrawer={openDrawer}/>
        </Body>
        <Footer />
      </Box>
    </ThemeContextProvider>
  );
};

export default PortalLayout;
