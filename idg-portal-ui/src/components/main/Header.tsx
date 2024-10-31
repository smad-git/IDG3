import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
  Box,
  InputLabel,
  FormControl,
  IconButton,
  Tooltip,
  Popover,
  Stack,
} from '@mui/material';
import { useThemeContext } from '../contexts/ThemeContext';
import { REGISTERED_THEMES } from '../common/themes/RegisterTheme';
import LogoutIcon from '@mui/icons-material/Logout';

import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { clearAllCookies } from '../../utils/utils';
import MenuIcon from '@mui/icons-material/Menu';

export interface HeaderProps {
  text?: string;
  headerClass?: string;
  showLogoutBtn?: boolean;
  searchTerm?: string;
  toggleDrawer?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  text,
  headerClass,
  showLogoutBtn,
  searchTerm,
  toggleDrawer,
}) => {
  const { currentTheme, setTheme } = useThemeContext();
  const navigate = useNavigate();
  const userContext = useUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'theme-popover' : undefined;

  const handleThemeChange = (themeName: string) => {
    setTheme(REGISTERED_THEMES[themeName].name);
  };

  const handleLogout = () => {
    userContext.logoutUser();
    clearAllCookies();
    navigate('/');
  };

  const toolbarIconBgColor =
    currentTheme === 'blue'
      ? 'blue.main'
      : currentTheme === 'green'
        ? 'green.main'
        : 'background.paper';

  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={toggleDrawer}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          sx={{ flexGrow: 1 }}
          className={`${headerClass}`}
        >
          {text}
        </Typography>
        <IconButton
          sx={{
            bgcolor: 'background.paper',
            borderRadius: '50%',
            border: '1px solid',
            borderColor: 'divider',
            p: 1,
          }}
          onClick={handleIconClick}
        >
          {REGISTERED_THEMES[currentTheme].icon}
        </IconButton>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Stack spacing={2} sx={{ p: 2 }}>
            {Object.keys(REGISTERED_THEMES).map((themeName) => (
              <Button
                key={themeName}
                onClick={() => handleThemeChange(themeName)}
                startIcon={REGISTERED_THEMES[themeName].icon}
                sx={{
                  justifyContent: 'flex-start',
                  width: '100%',
                  color:
                    themeName === currentTheme
                      ? 'primary.main'
                      : 'text.primary',
                  bgcolor:
                    themeName === currentTheme
                      ? 'action.selected'
                      : 'background.paper',
                }}
              >
                {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
              </Button>
            ))}
          </Stack>
        </Popover>

        {showLogoutBtn && (
          <Button color="inherit" onClick={handleLogout} sx={{ ml: 2 }}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <LogoutIcon />
              <Typography variant="body2">Logout</Typography>
            </Box>
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
