import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Card,
  CardContent,
  Grid,
  useTheme,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { PatientsListProps } from './Patients';
import ResponsivePagination from './ResponsivePagination';

const PatientsGrid: React.FC<PatientsListProps> = ({
  patients,
  totalCount,
  page, 
  onPageChange
}) => {
  const [expandedPatientId, setExpandedPatientId] = useState<string | null>(
    null
  );
  const rowsPerPage = 100;

  const theme = useTheme(); // Accessing the current theme

  const handleToggle = (patientId: string) => {
    setExpandedPatientId((prev) => (prev === patientId ? null : patientId));
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    onPageChange(page);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Patient Search Results
      </Typography>

      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  width: '20%',
                  backgroundColor:
                    theme.palette.mode === 'dark' ? '#333' : '#f0f0f0',
                  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                }}
              >
                Full Name
              </TableCell>
              <TableCell
                sx={{
                  width: '15%',
                  backgroundColor:
                    theme.palette.mode === 'dark' ? '#333' : '#f0f0f0',
                  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                }}
              >
                Email
              </TableCell>
              <TableCell
                sx={{
                  width: '10%',
                  backgroundColor:
                    theme.palette.mode === 'dark' ? '#333' : '#f0f0f0',
                  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                }}
              >
                Status
              </TableCell>
              <TableCell
                sx={{
                  width: '10%',
                  backgroundColor:
                    theme.palette.mode === 'dark' ? '#333' : '#f0f0f0',
                  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                }}
              >
                Gender
              </TableCell>
              <TableCell
                sx={{
                  width: '10%',
                  backgroundColor:
                    theme.palette.mode === 'dark' ? '#333' : '#f0f0f0',
                  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                }}
              >
                Race
              </TableCell>
              <TableCell
                sx={{
                  width: '15%',
                  backgroundColor:
                    theme.palette.mode === 'dark' ? '#333' : '#f0f0f0',
                  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                }}
              >
                DOB
              </TableCell>
              <TableCell
                sx={{
                  width: '20%',
                  backgroundColor:
                    theme.palette.mode === 'dark' ? '#333' : '#f0f0f0',
                  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                }}
              >
                Encounters
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {patients.map((patient) => (
              <React.Fragment key={patient.patientId}>
                <TableRow>
                  <TableCell>
                    {patient.firstName} {patient.lastName}
                  </TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>{patient.status}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>{patient.race}</TableCell>
                  <TableCell>
                    {patient.dateOfBirth
                      ? new Date(patient.dateOfBirth).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {patient.encounters.length > 0 ? (
                        <>
                          {patient.encounters.length} Encounter
                          {patient.encounters.length > 1 ? 's' : ''}
                          <IconButton
                            onClick={() => handleToggle(patient.patientId)}
                          >
                            {expandedPatientId === patient.patientId ? (
                              <ExpandLess />
                            ) : (
                              <ExpandMore />
                            )}
                          </IconButton>
                        </>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          No Encounters
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>

                {/* Collapsible Encounters */}
                {patient.encounters.length > 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      sx={{ paddingBottom: 0, paddingTop: 0 }}
                    >
                      <Collapse
                        in={expandedPatientId === patient.patientId}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ margin: 2 }}>
                          <Grid container spacing={2}>
                            {patient.encounters.map((encounter) => (
                              <Grid
                                item
                                xs={12}
                                sm={6}
                                key={encounter.encounterId}
                              >
                                <Card
                                  sx={{
                                    border: '1px solid #ddd',
                                    boxShadow: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    minHeight: '200px', // Ensure a consistent minimum height for all cards
                                  }}
                                >
                                  <CardContent sx={{ flex: 1 }}>
                                    <Typography
                                      variant="body1"
                                      sx={{ fontWeight: 'bold' }}
                                    >
                                      Encounter: {encounter.reason} -{' '}
                                      {encounter.encounterDate
                                        ? new Date(
                                            encounter.encounterDate
                                          ).toLocaleDateString()
                                        : 'N/A'}
                                    </Typography>
                                    <Box sx={{ paddingLeft: 2 }}>
                                      <Typography variant="subtitle2">
                                        Conditions:
                                      </Typography>
                                      {encounter.conditions.map((condition) => (
                                        <Typography
                                          key={condition.conditionId}
                                          variant="body2"
                                        >
                                          {condition.conditionCode} (Diagnosed:{' '}
                                          {condition.diagnosedAt
                                            ? new Date(
                                                condition.diagnosedAt
                                              ).toLocaleDateString()
                                            : 'N/A'}
                                          )
                                        </Typography>
                                      ))}

                                      <Typography
                                        variant="subtitle2"
                                        sx={{ marginTop: 1 }}
                                      >
                                        Medications:
                                      </Typography>
                                      {encounter.medications.map(
                                        (medication) => (
                                          <Typography
                                            key={medication.medicationId}
                                            variant="body2"
                                          >
                                            {medication.medicationName} -{' '}
                                            {medication.dosage} (From:{' '}
                                            {new Date(
                                              medication.startDate!
                                            ).toLocaleDateString()}{' '}
                                            to{' '}
                                            {new Date(
                                              medication.endDate!
                                            ).toLocaleDateString()}
                                            )
                                          </Typography>
                                        )
                                      )}
                                    </Box>
                                  </CardContent>
                                </Card>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" padding={2}>
        <ResponsivePagination
          currentPage={page}
          totalCount={totalCount}
          itemsPerPage={rowsPerPage}
          onChange={handlePageChange}
        />
      </Box>
    </Box>
  );
};

export default PatientsGrid;