import React, { useEffect, useState } from 'react';
import TuneIcon from '@mui/icons-material/Tune';
import SearchBar from './SearchBar'; // assuming you have a SearchBar component

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Box,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Pagination,
} from '@mui/material';

import {
  Search as SearchIcon,
  CloudDownload,
  Visibility,
  MoreVert,
} from '@mui/icons-material';

import InboxIcon from '@mui/icons-material/Inbox';

import PeopleIcon from '@mui/icons-material/People';

import SettingsIcon from '@mui/icons-material/Settings';
import { post, isCancelError } from 'aws-amplify/api';
import awsmobile from '../../../aws-exports';
import { DocumentType } from '@aws-amplify/core/internals/utils';

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
const columnConfig: ColumnConfig[] = [
  { key: 'name', label: 'Name', width: '20%' },
  { key: 'dateOfBirth', label: 'DOB', width: '20%' },
  { key: 'email', label: 'Email', width: '20%' },
  { key: 'phone', label: 'Phone', width: '20%' },
  { key: 'procedure', label: 'Procedure', width: '20%' },
  { key: 'doctor', label: 'Doctor', width: '20%' },
];

export const PatientSearch: React.FC<PropsWithChildren> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] =
    useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [data, setData] = useState<ResponsePayload>({totalCount: 0, results: []});
  const [totalCount, setTotalCount] = useState(0);

  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    patientSearch();
  });

  const patientSearch = async () => {
    const { response, cancel } = post({
      apiName: `${awsmobile.aws_cloud_logic_custom[0].name}`,
      path: '/patientMigration',
      options: {
        body: '',
      },
    });

    try {
      const resp = await response;
      const respPayload: any = await resp.body.json();
        respPayload.results.map((patient: any) => (
          patient.name = `${patient.firstName} ${patient.lastName}`
        ))
        setData(respPayload)
    } catch (e) {
      if (isCancelError(e)) {
        cancel('Cancelled');
      } else {
        console.error('Error in patient search:', e);
      }
    }
  };

  const onSearchChange = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const handleViewPatient = () => {
   // setSelectedPatient(patient);
   // setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPatient(null);
  };

  const filteredData: any[] = [];

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
          <SearchBar onSearchChange={onSearchChange} />
          <IconButton>
            <TuneIcon />
          </IconButton>
        </Box>

        {/* Configurable, Responsive Table */}
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table aria-label="Patient Data Table" size="small">
            <TableHead>
              <TableRow>
                {columnConfig.map((column) => (
                  <TableCell key={column.key} sx={{ width: column.width }}>
                    {column.label}
                  </TableCell>
                ))}
                <TableCell>Actions</TableCell> {/* Header for action buttons */}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.results?.map((row: any, rowIndex: number) => (
                <TableRow key={rowIndex}>
                  {columnConfig.map((column) => (
                    <TableCell key={column.key}>{row[column.key]}</TableCell>
                  ))}
                  <TableCell>
                    <IconButton onClick={() => handleViewPatient()}>
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box display="flex" justifyContent="center" padding={2}>
          <Pagination count={10} variant="outlined" color="primary" />
        </Box>
      </Box>

      {/* Patient Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Patient Details</DialogTitle>
        <DialogContent>
          {selectedPatient && (
            <Box>
              <Typography variant="h6">{selectedPatient.name}</Typography>
              <Typography>Age: {selectedPatient.age}</Typography>
              <Typography>Gender: {selectedPatient.gender}</Typography>
              <Typography>Email: {selectedPatient.email}</Typography>
              <Typography>Phone: {selectedPatient.phone}</Typography>
              <Typography>Procedure: {selectedPatient.procedure}</Typography>
              <Typography>Doctor: {selectedPatient.doctor}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
