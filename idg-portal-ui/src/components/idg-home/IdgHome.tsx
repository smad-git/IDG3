import React, { useState } from 'react';
import IdgHomeLayout from '../layouts/IdgHomeLayout';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Stack,
} from '@mui/material';
import './IdgHome.scss';
import { useNavigate } from 'react-router-dom';

export const IdgHome: React.FC = () => {
  const navigate = useNavigate();
  
  const handleLogin = (role: string) => {
    navigate(`/login?role=${role}`)
  };

  return (
    <>
      <IdgHomeLayout headerProps={{text: 'IDG'}}>
        <Box
          className="landing-page"
          sx={{ padding: '2rem', textAlign: 'center' }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={4}
            justifyContent="center"
          >
            <Card className="login-card" sx={{ flex: 1, maxWidth: 345 }}>
              <CardContent>
                <Typography variant="h5" component="div" className="card-title">
                  Login as Provider
                </Typography>
                <Typography variant="body2" className="card-description">
                  Access provider tools and manage patient care.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  className="login-btn"
                  onClick={() => handleLogin('provider')}
                >
                  Login
                </Button>
              </CardContent>
            </Card>
            <Card className="login-card" sx={{ flex: 1, maxWidth: 345 }}>
              <CardContent>
                <Typography variant="h5" component="div" className="card-title">
                  Login as Patient
                </Typography>
                <Typography variant="body2" className="card-description">
                  View your health records and manage appointments.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  className="login-btn"
                  onClick={() => handleLogin('patient')}
                >
                  Login
                </Button>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </IdgHomeLayout>
    </>
  );
};
