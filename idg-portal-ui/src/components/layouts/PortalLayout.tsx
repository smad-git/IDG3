// LandingPageLayout.tsx
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Footer from '../main/Footer';
import { ThemeContextProvider } from '../contexts/ThemeContext';
import Header from '../main/Header';
import Body from '../main/Body';
import PortalBodyLayout, { DrawerItem } from './PortalBodyLayout';
import {  ApiError, get, isCancelError } from 'aws-amplify/api';

export interface PortalLayoutProps {
  children: React.ReactNode;
  drawerConfig: DrawerItem[];
  headerText: string;
}

const PortalLayout: React.FC<PortalLayoutProps> = ({
  children,
  drawerConfig,
  headerText,
}) => {
  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    getTodo()
  }, [])

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  async function getTodo() {
    try {
      const restOperation = get({ 
        apiName: 'idgApi',
        path: '/patientMigration' 
      });
      const response = await restOperation.response;
      console.log('GET call succeeded: ', response);
    } catch (e: unknown) {
      if (e instanceof ApiError) {
        console.log(e.response?.body)
      }
    }
  }

  return (
    <ThemeContextProvider>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        <Header
          showLogoutBtn={true}
          toggleDrawer={toggleDrawer}
          text={headerText}
        />
        <Body>
          <PortalBodyLayout
            drawerConfig={drawerConfig}
            children={children}
            toggleDrawer={toggleDrawer}
            openDrawer={openDrawer}
          />
        </Body>
        <Footer />
      </Box>
    </ThemeContextProvider>
  );
};

export default PortalLayout;
