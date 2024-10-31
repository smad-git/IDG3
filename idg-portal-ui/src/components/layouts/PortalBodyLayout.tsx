import React from 'react';
import {
  Toolbar,
  IconButton,
  Drawer,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  useMediaQuery,
  Theme,
  useTheme,
  Tooltip,
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidthOpen = 240;
const drawerWidthClosed = 72;

export interface DrawerItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface PortalBodyLayoutProps {
  drawerConfig: DrawerItem[];
  children: React.ReactNode;
  openDrawer: boolean;
  toggleDrawer?: () => void;
}

const PortalBodyLayout: React.FC<PortalBodyLayoutProps> = ({
  drawerConfig,
  openDrawer,
  toggleDrawer,
  children,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm')
  );

  const renderDrawerContent = () => {
    return drawerConfig.map((item, index) => {
      return (
        <NavLink
          key={index}
          to={item.path}
          style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive
              ? theme.palette.primary.main
              : theme.palette.text.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px',
            backgroundColor: isActive
              ? theme.palette.action.hover
              : 'transparent',
          })}
        >
          {({ isActive }) => (
            <>
              <Tooltip
                title={item.label}
                placement="right"
                arrow
                disableHoverListener={openDrawer}
              >
                <>
                  <ListItemIcon
                    sx={{
                      color: isActive
                        ? theme.palette.primary.main
                        : theme.palette.text.primary,
                        alignItems: "center"
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {openDrawer && (
                    <ListItemText
                      primary={item.label}
                      sx={{
                        color: isActive
                          ? theme.palette.primary.main
                          : theme.palette.text.primary,
                      }}
                    />
                  )}
                </>
              </Tooltip>
            </>
          )}
        </NavLink>
      );
    });
  };

  return (
    <>
      <Drawer
        variant={
          isMobile ? 'temporary' : openDrawer ? 'temporary' : 'permanent'
        }
        open={openDrawer}
        onClose={toggleDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            width: isMobile
              ? openDrawer
                ? drawerWidthOpen
                : 0
              : openDrawer
                ? drawerWidthOpen
                : drawerWidthClosed,
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            overflowX: 'hidden',
            zIndex: (theme) => theme.zIndex.appBar - 1,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.palette.text.primary,
              textDecoration: 'none',
              '&:hover': {
                color: theme.palette.primary.main,
              },
             }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        {renderDrawerContent()}
      </Drawer>
      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: {
            xs: 0,
            sm: 0,
            md: openDrawer ? `${drawerWidthOpen}px` : `${drawerWidthClosed}px`,
          },
          transition: theme.transitions.create('margin-left', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {children}
      </Box>
    </>
  );
};

export default PortalBodyLayout;
