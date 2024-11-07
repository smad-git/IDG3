import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Collapse,
  Divider,
  Pagination,
  Grid,
  useTheme,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { PatientsListProps } from './Patients';

const PatientStack: React.FC<PatientsListProps> = ({
  patients,
  totalCount,
  page,
  onPageChange,
}) => {
  const theme = useTheme();
  const [expandedPatient, setExpandedPatient] = useState<string | null>(null);
  const itemsPerPage = 20; // Number of patients to show per page

  const handleTogglePatientDetails = (patientId: string) => {
    setExpandedPatient((prev) => (prev === patientId ? null : patientId));
  };

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    onPageChange(value);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography
        variant="h5"
        sx={{
          marginBottom: 2,
          fontWeight: 600,
          color: `${theme.palette.mode === 'dark' ? '#fff' : theme.palette.primary.main}`,
        }}
      >
        Patient Search Results
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)', // 1 card per row on extra-small screens
            sm: 'repeat(2, 1fr)', // 2 cards per row on small screens
            md: 'repeat(2, 1fr)', // 2 cards per row on medium screens
            lg: 'repeat(3, 1fr)', // 3 cards per row on medium screens
            xl: 'repeat(4, 1fr)', // 4 cards per row on extra-large screens
          },
          gap: '16px', // space between grid items
          width: '100%', // ensures the grid takes full width
        }}
      >
        {patients?.map((patient) => (
          <Grid item key={patient.patientId} xs={12} sm={6} md={4}>
            <Paper
              sx={{
                padding: 2,
                borderRadius: 2,
                backgroundColor: 'background.paper',
                boxShadow: 3,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 6,
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 500, color: 'text.primary' }}
              >
                {patient.firstName} {patient.lastName}
              </Typography>
              <Divider sx={{ margin: '10px 0' }} />

              <Box>
                <Typography variant="body2" color="text.secondary">
                  <strong>Email: </strong>
                  {patient.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Status: </strong>
                  {patient.status}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Gender: </strong>
                  {patient.gender}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Race: </strong>
                  {patient.race}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>DOB: </strong>
                  {patient.dateOfBirth
                    ? new Date(patient.dateOfBirth).toLocaleDateString()
                    : 'N/A'}
                </Typography>
              </Box>

              <Box sx={{ marginTop: 2 }}>
                <IconButton
                  onClick={() => handleTogglePatientDetails(patient.patientId)}
                  sx={{
                    marginBottom: 2,
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: (theme) => theme.palette.action.hover, // Use theme color for background
                    '&:hover': {
                      backgroundColor: (theme) => theme.palette.action.selected, // Hover effect color
                    },
                    borderRadius: 2,
                    padding: 1,
                  }}
                >
                  {expandedPatient === patient.patientId ? (
                    <>
                      <Typography variant="body2" sx={{ marginRight: 1 }}>
                        Show Less
                      </Typography>
                      <ExpandLess />
                    </>
                  ) : (
                    <>
                      <Typography variant="body2" sx={{ marginRight: 1 }}>
                        Show More
                      </Typography>
                      <ExpandMore />
                    </>
                  )}
                </IconButton>

                <Collapse in={expandedPatient === patient.patientId}>
                  <Box sx={{ paddingLeft: 2, marginTop: 1 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: 'primary.dark' }}
                    >
                      Patient Details:
                    </Typography>
                    <Divider sx={{ margin: '10px 0' }} />
                    <Typography variant="body2" color="text.secondary">
                      <strong>Address: </strong>
                      {patient.address || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Created At: </strong>
                      {patient.createdAt
                        ? new Date(patient.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </Typography>

                    {patient.encounters.map((encounter) => (
                      <Box key={encounter.encounterId} sx={{ marginTop: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Encounter: {encounter.reason} -{' '}
                          {new Date(
                            encounter.encounterDate!
                          ).toLocaleDateString()}
                        </Typography>

                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, color: 'primary.dark' }}
                        >
                          Conditions:
                        </Typography>
                        {encounter.conditions.map((condition) => (
                          <Typography
                            key={condition.conditionId}
                            variant="body2"
                            color="text.secondary"
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

                        <Divider sx={{ margin: '10px 0' }} />
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, color: 'primary.dark' }}
                        >
                          Medications:
                        </Typography>
                        {encounter.medications.map((medication) => (
                          <Typography
                            key={medication.medicationId}
                            variant="body2"
                            color="text.secondary"
                          >
                            {medication.medicationName} - {medication.dosage}{' '}
                            (From:{' '}
                            {new Date(
                              medication.startDate!
                            ).toLocaleDateString()}{' '}
                            to{' '}
                            {new Date(medication.endDate!).toLocaleDateString()}
                            )
                          </Typography>
                        ))}
                      </Box>
                    ))}
                  </Box>
                </Collapse>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Box>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
        <Pagination
          count={Math.ceil(totalCount / itemsPerPage)}
          page={page}
          onChange={handleChangePage}
          color="primary"
          siblingCount={1}
          boundaryCount={1}
        />
      </Box>
    </Box>
  );
};

export default PatientStack;
