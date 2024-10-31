import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { User, useUser } from '../../contexts/UserContext';
import { getTokenFromCookie } from '../../../utils/utils';
import { jwtDecode } from 'jwt-decode';
import _ from 'lodash';

interface PrivateRouteProps {
  children: JSX.Element;
  role: string; 
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, role }) => {

  const validateUser = () => {
    const token = getTokenFromCookie();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const user:User = {
        name: decodedToken.name,
        email: decodedToken.email,
        role: decodedToken.sub === 'IDG-PROVIDER' ? 'provider' : 'patient'
      }
      return user.role;
    }
  }

  const isAuthenticated = () => {
    return role === validateUser()
  };
  
  return isAuthenticated() ? children : <Navigate to="/" />;
};

export default PrivateRoute;
