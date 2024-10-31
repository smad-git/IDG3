import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { User, useUser } from '../../contexts/UserContext';
import { getTokenFromCookie } from '../../../utils/utils';
import { jwtDecode } from 'jwt-decode';
import _ from 'lodash';

interface PublicRouteProps {
  children: JSX.Element;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {

  
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

  const getUrl = () => {
    const role = validateUser()
    return role ? <Navigate to={`/${role}`}/> : children; 
  };
  
  return getUrl()
};

export default PublicRoute;
