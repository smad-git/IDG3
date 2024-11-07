import React, { useEffect, useState } from 'react';

import SearchBar, { SearchCriteria } from './SearchBar';
import { IconButton, Box } from '@mui/material';
import { post, isCancelError } from 'aws-amplify/api';
import awsmobile from '../../../aws-exports';
import PatientStack from './PatientStack';
import PatientsCard from './PatientsCard';
import PatientsGrid from './PatientsGrid';
import { useLoading } from '../../contexts/LoadingContext';

interface ColumnConfig {
  key: string;
  label: string;
  width?: string;
}
interface ResponsePayload {
  totalCount: number;
  results: any;
}
interface PropsWithChildren<T = {}> {
  children?: React.ReactNode;
}

// Sample JSON data and column configuration
export const columnConfig: ColumnConfig[] = [
  { key: 'name', label: 'Name', width: '20%' },
  { key: 'dateOfBirth', label: 'DOB', width: '20%' },
  { key: 'email', label: 'Email', width: '20%' },
  { key: 'address', label: 'Phone', width: '20%' },
  { key: 'procedure', label: 'Procedure', width: '20%' },
  { key: 'doctor', label: 'Doctor', width: '20%' },
];

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
    pageSize: number = 100
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

  const onSearchChange = (updatedFilters: SearchCriteria) => {
    setFilters(updatedFilters);
    const filteredData = Object.fromEntries(
      Object.entries(updatedFilters).filter(
        ([key, value]) =>
          value !== '' &&
          value !== null &&
          (Array.isArray(value) ? value.some((v) => v !== null) : true)
      )
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
        <SearchBar onSearchChange={onSearchChange}/>
        <PatientsGrid patients={data.results} totalCount={data.totalCount} onPageChange={onPageChange} page={page}/>
         {/* <PatientsCard patients={data.results} totalCount={data.totalCount} onPageChange={onPageChange} page={page}/> 
          
        <PatientStack patients={data.results} totalCount={data.totalCount} onPageChange={onPageChange} page={page}/>  */}
      </Box>
    </>
  );
};
