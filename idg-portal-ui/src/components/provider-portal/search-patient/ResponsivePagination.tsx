import React from 'react';
import { Box, Pagination, useMediaQuery, useTheme } from '@mui/material';
import { PatientsPaginationProps } from './Patients';

const ResponsivePagination: React.FC<PatientsPaginationProps> = ({ currentPage, totalCount, itemsPerPage, onChange }) => {
  const theme = useTheme();
  
  // Use media queries to detect screen sizes
  const isXs = useMediaQuery(theme.breakpoints.down('xs')); // Extra-small devices
  const isSm = useMediaQuery(theme.breakpoints.down('sm')); // Small devices
  const isMd = useMediaQuery(theme.breakpoints.down('md')); // Medium devices

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Determine pagination settings based on screen size
  const getPaginationSettings = () => {
    if (isXs) {
      return { siblingCount: 0, boundaryCount: 0, showFirstButton: false, showLastButton: false, size: 'small' as 'small' };
    } else if (isSm) {
      return { siblingCount: 1, boundaryCount: 0, showFirstButton: false, showLastButton: false, size: 'small' as 'small' };
    } else if (isMd) {
      return { siblingCount: 1, boundaryCount: 1, showFirstButton: true, showLastButton: true, size: 'medium' as 'medium' };
    } else {
      return { siblingCount: 2, boundaryCount: 2, showFirstButton: true, showLastButton: true, size: 'medium' as 'medium' };
    }
  };

  const paginationSettings = getPaginationSettings();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={onChange}
        color="primary"
        siblingCount={paginationSettings.siblingCount}
        boundaryCount={paginationSettings.boundaryCount}
        showFirstButton={paginationSettings.showFirstButton}
        showLastButton={paginationSettings.showLastButton}
        size={paginationSettings.size} // Explicitly cast size
      />
    </Box>
  );
};

export default ResponsivePagination;
