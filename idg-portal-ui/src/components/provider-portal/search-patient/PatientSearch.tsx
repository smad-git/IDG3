import { PropsWithChildren, useState } from 'react';
import { ChildrenProps } from '../../../types/CommonTypes';
import { Box, IconButton} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import SearchBar from './SearchBar';

export const PatientSearch: React.FC<PropsWithChildren<ChildrenProps>> = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const onSearchChange = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  return (
    <>
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            flexDirection: 'row',
          }}
        >
          <SearchBar />
          <IconButton>
            <TuneIcon/>
          </IconButton>
        </Box>
      </Box>
    </>
  );
};
