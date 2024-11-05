import React, { useState } from 'react';
import TuneIcon from '@mui/icons-material/Tune';
import SearchBar from './SearchBar'; // assuming you have a SearchBar component

import { 

  AppBar, Toolbar, Typography, IconButton, InputBase, Paper, Table, TableBody, 

  TableCell, TableContainer, TableHead, TableRow, Avatar, Box, Tab, Tabs, Dialog, 

  DialogTitle, DialogContent, DialogActions, Button, Pagination 

} from '@mui/material';

import { Search as SearchIcon, CloudDownload, Visibility, MoreVert } from '@mui/icons-material';

import InboxIcon from '@mui/icons-material/Inbox';

import PeopleIcon from '@mui/icons-material/People';

import SettingsIcon from '@mui/icons-material/Settings';

interface ColumnConfig {
  key: string;
  label: string;
  width?: string;
}

interface DataRow {
  [key: string]: any;
}

interface PropsWithChildren<T = {}> {
  children?: React.ReactNode;
}

// Sample JSON data and column configuration
const columnConfig: ColumnConfig[] = [
  { key: 'name', label: 'Name', width: '20%' },
  { key: 'age', label: 'Age', width: '20%' },
  { key: 'gender', label: 'Gender', width: '20%' },
  { key: 'email', label: 'Email', width: '20%' },
  { key: 'phone', label: 'Phone', width: '20%' },
  { key: 'procedure', label: 'Procedure', width: '20%' },
  { key: 'doctor', label: 'Doctor', width: '20%' }
];

const rowData: DataRow[] = [
  {
    name
      :
      'Myles Le'
    ,
    age
      : 35,
    gender
      :
      'Male'
    ,
    email
      :
      'le.myles@gmail.com'
    ,
    phone
      :
      '+1 (987) 3398 388'
    ,
    procedure
      :
      'Fracture'
    ,
    doctor
      :
      'Dr. Daniel McAdams'
  }, {
    name
      :
      'Mylah Bean'
    ,
    age
      : 37,
    gender
      :
      'Female'
    ,
    email
      :
      'beans.mylah@yahoo.com'
    ,
    phone
      :
      '+1 (476) 5587 338'
    ,
    procedure
      :
      'Prenatal'
    ,
    doctor
      :
      'Dr. Emily Johnson'
  }, {
    name
      :
      'Anika Smith'
    ,
    age
      : 87,
    gender
      :
      'Female'
    ,
    email
      :
      'anika.smith@gmail.com'
    ,
    phone
      :
      '+1 (776) 3398 886'
    ,
    procedure
      :
      'CBT'
    ,
    doctor
      :
      'Dr. Michael Lee'
  }, {
    name
      :
      'Niklaus Kemp'
    ,
    age
      : 40,
    gender
      :
      'Male'
    ,
    email
      :
      'nike_kemp@gmail.com'
    ,
    phone
      :
      '+1 (887) 6687 776'
    ,
    procedure
      :
      'Psychotherapy'
    ,
    doctor
      :
      'Dr. Emily Johnson'
  }, {
    name
      :
      'Brett Lopez'
    ,
    age
      : 28,
    gender
      :
      'Male'
    ,
    email
      :
      'brett.lopez@gmail.com'
    ,
    phone
      :
      '+1 (339) 9978 009'
    ,
    procedure
      :
      'Colonoscopy'
    ,
    doctor
      :
      'Dr. Daniel McAdams'
  }, {
    name
      :
      'Nolan Keith'
    ,
    age
      : 32,
    gender
      :
      'Male'
    ,
    email
      :
      'nolan.keith@gmail.com'
    ,
    phone
      :
      '+1 (887) 7767 446'
    ,
    procedure
      :
      'Angioplasty'
    ,
    doctor
      :
      'Dr. Emily Johnson'
  }, {
    name
      :
      'Tate Michael'
    ,
    age
      : 48,
    gender
      :
      'Male'
    ,
    email
      :
      'tate.mike@gmail.com'
    ,
    phone
      :
      '+1 (776) 9987 339'
    ,
    procedure
      :
      'X-ray'
    ,
    doctor
      :
      'Dr. Michael Lee'
  }, {
    name
      :
      'Diana Robinson'
    ,
    age
      : 48,
    gender
      :
      'Female'
    ,
    email
      :
      'diana.robi@gmail.com'
    ,
    phone
      :
      '+1 (776) 9987 325'
    ,
    procedure
      :
      'LASIK Eye Surgery'
    ,
    doctor
      :
      'Dr. Michael Lee'
  }, {
    name
      :
      'Kim Dowry'
    ,
    age
      : 52,
    gender
      :
      'Female'
    ,
    email
      :
      'kim.dowry@gmail.com'
    ,
    phone
      :
      '+1 (887) 6687 776'
    ,
    procedure
      :
      'Colonoscopy'
    ,
    doctor
      :
      'Dr. Emily Johnson'
  }, {
    name
      :
      'Sean Perry'
    ,
    age
      : 54,
    gender
      :
      'Male'
    ,
    email
      :
      'sean.perry@gmail.com'
    ,
    phone
      :
      '+1 (339) 5587 887'
    ,
    procedure
      :
      'CT Scan'
    ,
    doctor
      :
      'Dr. Daniel McAdams'
  }, {
    name
      :
      'Ava Parker'
    ,
    age
      : 30,
    gender
      :
      'Female'
    ,
    email
      :
      'ava.parker@gmail.com'
    ,
    phone
      :
      '+1 (776) 9987 775'
    ,
    procedure
      :
      'MRI'
    ,
    doctor
      :
      'Dr. Emily Johnson'
  }, {
    name
      :
      'Evan Reyes'
    ,
    age
      : 27,
    gender
      :
      'Male'
    ,
    email
      :
      'evan.reyes@gmail.com'
    ,
    phone
      :
      '+1 (887) 6687 449'
    ,
    procedure
      :
      'Psychotherapy'
    ,
    doctor
      :
      'Dr. Michael Lee'
  }, {
    name
      :
      'Lily Carter'
    ,
    age
      : 25,
    gender
      :
      'Female'
    ,
    email
      :
      'lily.carter@gmail.com'
    ,
    phone
      :
      '+1 (339) 7787 883'
    ,
    procedure
      :
      'Prenatal'
    ,
    doctor
      :
      'Dr. Emily Johnson'
  }, {
    name
      :
      'Jack White'
    ,
    age
      : 38,
    gender
      :
      'Male'
    ,
    email
      :
      'jack.white@gmail.com'
    ,
    phone
      :
      '+1 (998) 3387 553'
    ,
    procedure
      :
      'Angioplasty'
    ,
    doctor
      :
      'Dr. Michael Lee'
  }, {
    name
      :
      'Emily Green'
    ,
    age
      : 36,
    gender
      :
      'Female'
    ,
    email
      :
      'emily.green@gmail.com'
    ,
    phone
      :
      '+1 (887) 6687 556'
    ,
    procedure
      :
      'Fracture'
    ,
    doctor
      :
      'Dr. Daniel McAdams'
  }, {
    name
      :
      'Olivia Lewis'
    ,
    age
      : 34,
    gender
      :
      'Female'
    ,
    email
      :
      'olivia.lewis@gmail.com'
    ,
    phone
      :
      '+1 (776) 5587 337'
    ,
    procedure
      :
      'X-ray'
    ,
    doctor
      :
      'Dr. Emily Johnson'
  }, {
    name
      :
      'Lucas Martinez'
    ,
    age
      : 33,
    gender
      :
      'Male'
    ,
    email
      :
      'lucas.martinez@gmail.com'
    ,
    phone
      :
      '+1 (887) 6677 788'
    ,
    procedure
      :
      'Colonoscopy'
    ,
    doctor
      :
      'Dr. Michael Lee'
  }, {
    name
      :
      'Sophia Jackson'
    ,
    age
      : 47,
    gender
      :
      'Female'
    ,
    email
      :
      'sophia.jackson@gmail.com'
    ,
    phone
      :
      '+1 (776) 9987 554'
    ,
    procedure
      :
      'MRI'
    ,
    doctor
      :
      'Dr. Daniel McAdams'
  }, {
    name
      :
      'Henry Wood'
    ,
    age
      : 29,
    gender
      :
      'Male'
    ,
    email
      :
      'henry.wood@gmail.com'
    ,
    phone
      :
      '+1 (339) 7787 884'
    ,
    procedure
      :
      'Angioplasty'
    ,
    doctor
      :
      'Dr. Emily Johnson'
  }, {
    name
      :
      'Madison Hall'
    ,
    age
      : 26,
    gender
      :
      'Female'
    ,
    email
      :
      'madison.hall@gmail.com'
    ,
    phone
      :
      '+1 (887) 6687 777'
    ,
    procedure
      :
      'Prenatal'
    ,
    doctor
      :
      'Dr. Michael Lee'
  }
];

export const PatientSearch: React.FC<PropsWithChildren> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<DataRow | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [tabValue, setTabValue] = useState(0);

  const onSearchChange = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const handleViewPatient = (patient: DataRow) => {

    setSelectedPatient(patient);

    setOpenDialog(true);

  };
 
  const handleCloseDialog = () => {

    setOpenDialog(false);

    setSelectedPatient(null);

  };

  const filteredData = rowData.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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
      {filteredData.map((row, rowIndex) => (
        <TableRow key={rowIndex}>
          {columnConfig.map((column) => (
            <TableCell key={column.key}>{row[column.key]}</TableCell>
          ))}
          <TableCell>
            <IconButton onClick={() => handleViewPatient(row)}>
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
