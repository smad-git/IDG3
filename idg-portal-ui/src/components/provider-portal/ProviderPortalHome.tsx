// PatientPortal.tsx
import React from 'react';
import PortalLayout from '../layouts/PortalLayout';
import { PROVIDER_MENU } from './config/MenuConfiguration';
import { Outlet } from 'react-router-dom';

export const ProviderPortalHome: React.FC = () => {
  return (
    <>
      <PortalLayout drawerConfig={PROVIDER_MENU} headerText='IDG'>
        <Outlet/>
      </PortalLayout>
    </>
  );
};
