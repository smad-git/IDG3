import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

export const PROVIDER_MENU = [
    {
      path: 'dashboard',
      label: 'Dashboard',
      icon: <SpaceDashboardIcon/>,
    },
    {
      path: 'addPatient',
      label: 'Add Patient',
      icon: <PersonAddAlt1Icon />,
    },
    {
      path: 'searchPatients',
      label: 'Search Patient',
      icon: <PersonSearchIcon />,
    },
];