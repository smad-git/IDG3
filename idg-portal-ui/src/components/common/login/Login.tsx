import { Box, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { APP_CONSTANTS } from '../../../constants/app-constants';
import { useUser } from '../../contexts/UserContext';
import IdgHomeLayout from '../../layouts/IdgHomeLayout';

const Login: React.FC = (props) => {
  const navigate = useNavigate();
  const usetContext = useUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const [role, setRole] = useState('');

  useEffect(() => {
    const userRole = searchParams.get('role');
    if (userRole) {
      setRole(userRole);
    }
  }, []);

  const handleLogin = () => {
    if (role === 'provider') {
      document.cookie = `jwtToken=${APP_CONSTANTS.provider}; path=/; Secure; SameSite=Strict`;
    } else if (role === 'patient') {
      document.cookie = `jwtToken=${APP_CONSTANTS.patient}; path=/; Secure; SameSite=Strict`;
    }
    navigate(`/`);
  };

  return (
    <IdgHomeLayout headerProps={{text: 'IDG'}} 
      bodyProps={{className: 'd-flex justify-content-center align-items-center'}}>
      <Button
        variant="contained"
        color="primary"
        className="login-btn"
        onClick={handleLogin}
      >
        Login
      </Button>
    </IdgHomeLayout>
  );
};

export default Login;
