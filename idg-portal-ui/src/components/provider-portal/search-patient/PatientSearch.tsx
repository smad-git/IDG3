import React, { useEffect, useState } from 'react';

import SearchBar, { SearchCriteria } from './SearchBar';
import { IconButton, Box, useTheme, useMediaQuery } from '@mui/material';
import { post, isCancelError } from 'aws-amplify/api';
import awsmobile from '../../../aws-exports';
import PatientStack from './PatientStack';
import PatientsCard from './PatientsCard';
import PatientsGrid from './PatientsGrid';
import { useLoading } from '../../contexts/LoadingContext';

interface ResponsePayload {
  totalCount: number;
  results: any;
}
interface PropsWithChildren<T = {}> {
  children?: React.ReactNode;
}

export const PatientSearch: React.FC<PropsWithChildren> = () => {
  const [data, setData] = useState<ResponsePayload>({
    totalCount: 0,
    results: [],
  });

  const { isLoading, setLoading } = useLoading();
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (data.results && data.results.length < 1) {
      const request = {
        pageSize: 25,
        page: 1,
      };
      patientSearch(request, page);
    }
  }, []);

  const patientSearch = async (
    searchQuery: any,
    page: number,
    pageSize: number = 20
  ) => {
    setLoading(true);
    const { response, cancel } = post({
      apiName: `${awsmobile.aws_cloud_logic_custom[0].name}`,
      path: '/patientMigration',
      options: {
        body: searchQuery,
        queryParams: { page: `${page}`, pageSize: `${pageSize}` },
      },
    });

    try {
      const resp = await response;
      const respPayload: any = await resp.body.json();
      respPayload.results.map(
        (patient: any) =>
          (patient.name = `${patient.firstName} ${patient.lastName}`)
      );
      setData(respPayload);
      setPage(page);
      setLoading(false);
    } catch (e) {
      if (isCancelError(e)) {
        cancel('Cancelled');
        setLoading(false);
      } else {
        setLoading(false);
        console.error('Error in patient search:', e);
      }
    }
  };
  const [filters, setFilters] = useState<SearchCriteria>({
    unifiedSearch: '',
    patientId: '',
    email: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    medicationName: '',
    conditionCode: '',
    encounterDateRange: [null, null],
  });

  const theme = useTheme();
  // Check for screen width and orientation
  const isSmallScreen = useMediaQuery('(max-width: 1180px)'); // If screen width is <= 1180px
  const isLargeScreen = useMediaQuery('(min-width: 1181px)'); // If screen width is > 1180px
  const isLandscape = useMediaQuery('(orientation: landscape)'); // Check for landscape orientation

  // Show Grid Layout (Table) for screens > 1180px or iPad in Landscape
  // Show Card Layout for screens <= 1180px or iPad in Portrait
  const shouldShowGridLayout = isLargeScreen || (isLandscape && !isSmallScreen); // Grid for larger screens and iPad landscape

  const onSearchChange = (updatedFilters: SearchCriteria) => {
    setFilters(updatedFilters);
    const filteredData = Object.fromEntries(
      Object.entries(updatedFilters)
        .filter(
          ([key, value]) =>
            value !== null &&
            value !== '' &&
            (typeof value === 'string' ? value.trim() !== '' : true) &&
            (Array.isArray(value) ? value.some((v) => v !== null) : true)
        )
        .map(([key, value]) => [
          key,
          Array.isArray(value)
            ? value.map((v) => (typeof v === 'string' ? v.trim() : v))
            : typeof value === 'string'
              ? value.trim()
              : value,
        ])
    );
    patientSearch(filteredData, page);
  };

  const onPageChange = (page: number) => {
    const filteredData = Object.fromEntries(
      Object.entries(filters).filter(
        ([key, value]) =>
          value !== '' &&
          value !== null &&
          (Array.isArray(value) ? value.some((v) => v !== null) : true)
      )
    );
    patientSearch(filteredData, page);
  };

  return (
    <>
      <Box>
        <SearchBar onSearchChange={onSearchChange} />
        {/* Show GridLayout for screens > 1180px or iPad in Landscape mode */}
        {shouldShowGridLayout ? (
          <PatientsGrid
            patients={data.results}
            totalCount={data.totalCount}
            onPageChange={onPageChange}
            page={page}
          />
        ) : null}

        {/* Show CardLayout for screens <= 1180px or iPad in Portrait mode */}
        {!shouldShowGridLayout ? (
          <PatientStack
            patients={data.results}
            totalCount={data.totalCount}
            onPageChange={onPageChange}
            page={page}
          />
        ) : null}

        {/* <PatientsCard patients={data.results} totalCount={data.totalCount} onPageChange={onPageChange} page={page}/> */}
      </Box>
    </>
  );
};
