// PatientPortal.tsx
import React from 'react';
import PortalLayout from '../layouts/PortalLayout';
import { PATIENT_MENU } from './config/MenuConfiguration';

export const PatientPortalHome: React.FC = () => {
  return (
    <>
      <PortalLayout drawerConfig={PATIENT_MENU} headerText='IDG'>
        <h1>Welcome to the Patient Portal</h1>
      </PortalLayout>
    </>
  );
};
