import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        p: 2,
        bgcolor: (theme) => theme.palette.primary.main,
        color: (theme) => theme.palette.text.footerText,
        zIndex: (theme) => theme.zIndex.appBar
      }}
    >
      <Typography variant="body1">© 2024 IDG Code Challenge</Typography>
    </Box>
  );
};

export default Footer;
