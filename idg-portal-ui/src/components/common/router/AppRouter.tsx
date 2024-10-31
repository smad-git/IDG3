import { Navigate, Route, Routes } from 'react-router-dom';
import { useMemo } from 'react';
import PrivateRoute from './PrivateRoute';
import { ProviderPortalHome } from '../../provider-portal/ProviderPortalHome';
import { PatientPortalHome } from '../../patient-portal/PatientPortalHome';
import { IdgHome } from '../../idg-home/IdgHome';
import LandingPage from '../../main/LandingPage';
import Login from '../login/Login';
import PublicRoute from './PublicRoute';
import { Dashboard } from '../../provider-portal/dashboard/Dashboard';
import { AddPatient } from '../../provider-portal/add-aptient/AddPatient';
import { PatientSearch } from '../../provider-portal/search-patient/PatientSearch';

interface RouteConfig {
  path: string;
  component: JSX.Element;
  children?: RouteConfig[];
  isPrivate?: boolean;
  role?: string;
}

export const ROUTES: RouteConfig[] = [
  {
    path: '/',
    component: <LandingPage />,
  },
  {
    path: '/home',
    component: <IdgHome />,
  },
  {
    path: '/login',
    component: <Login />,
  },
  {
    path: '/patient',
    component: <PatientPortalHome />,
    isPrivate: true,
    role: 'patient'
  },
  {
    path: '/provider',
    component: <ProviderPortalHome />,
    isPrivate: true,
    role: 'provider',
    children: [
      {
        path: '',
        component: <Navigate to="searchPatients" /> ,
        isPrivate: true,
        role: 'provider',
      },
      {
        path: 'dashboard',
        component: <Dashboard />,
        isPrivate: true,
        role: 'provider',
      },
      {
        path: 'addPatient',
        component: <AddPatient />,
        isPrivate: true,
        role: 'provider',
      },
      {
        path: 'searchPatients',
        component: <PatientSearch />,
        isPrivate: true,
        role: 'provider',
      }
    ],
  },
];

export const AppRouter: React.FC = () => {
  const getComponent = (component: JSX.Element, path: string, isPrivate?: boolean, role?: string) => {
    if (isPrivate && role) {
      return <PrivateRoute role={role}>{component}</PrivateRoute>;
    } else {
      return <PublicRoute>{component}</PublicRoute>;
    }
    return component;
  };

  const renderRoutesRecursive = (routes: RouteConfig[]) => {
    return routes.map((route, index) => {
      if (route.children) {
        return (
          <Route
            key={index}
            path={route.path}
            element={getComponent(route.component, route.path, route.isPrivate, route.role)}
          >
            {renderRoutesRecursive(route.children)}
          </Route>
        );
      } else {
        return (
          <Route
            key={index}
            path={route.path}
            element={getComponent(route.component, route.path, route.isPrivate, route.role)}
          />
        );
      }
    });
  };

  const renderRoutes = useMemo(() => renderRoutesRecursive(ROUTES), []);

  return <Routes>{renderRoutes}</Routes>;
};
