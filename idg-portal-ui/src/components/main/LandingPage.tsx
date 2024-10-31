import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTokenFromCookie } from '../../utils/utils';
import { jwtDecode } from 'jwt-decode';
import { User, useUser } from '../contexts/UserContext';
import _ from 'lodash';

const LandingPage = () => {
  const navigate = useNavigate()
  const userContext = useUser()
  const location = useLocation();

  useEffect(() => {
    const role = validateUser()
    if (!role) {
      navigate('/home')
    } else {
      navigate(`/${role}`)
    }
  }, [])

  const validateUser = () => {
    const token = getTokenFromCookie();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const user:User = {
        name: decodedToken.name,
        email: decodedToken.email,
        role: decodedToken.sub === 'IDG-PROVIDER' ? 'provider' : 'patient'
      }
      const isSameUser = _.isEqual(userContext.user, user)
      if (!isSameUser) {
        userContext.loginUser(user) 
      }
      return user.role;
    } else {
      return null;
    }
  
  }
  
  return (
    <>
    </>
  )
}

export default LandingPage;
