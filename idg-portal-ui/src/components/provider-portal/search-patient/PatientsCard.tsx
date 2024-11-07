import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Container,
  Pagination,
} from '@mui/material';
import { PatientsListProps } from './Patients';
import _ from 'lodash';

const ITEMS_PER_PAGE = 100; // Customize the number of items per page

const PatientsCard: React.FC<PatientsListProps> = ({ patients, totalCount, page, onPageChange }) => {
 
  // Pagination logic
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    onPageChange(page);
  };

  const sortedPatients = _.cloneDeep(patients)
    .map((patient) => {
      const sortedEncounters = patient.encounters?.length
        ? [...patient.encounters].sort(
            (a, b) =>
              new Date(b.encounterDate).getTime() -
              new Date(a.encounterDate).getTime()
          )
        : [];

      return {
        ...patient,
        encounters: sortedEncounters,
      };
    })
    .sort((a, b) => {
      const aRecentDate = a.encounters[0]?.encounterDate;
      const bRecentDate = b.encounters[0]?.encounterDate;

      return (
        new Date(bRecentDate || 0).getTime() -
        new Date(aRecentDate || 0).getTime()
      );
    });

  return (
    <>
      {sortedPatients.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)', // 1 card per row on small screens
              sm: 'repeat(2, 1fr)', // 2 cards per row on medium screens
              md: 'repeat(3, 1fr)', // 3 cards per row on larger screens
              xl: 'repeat(4, 1fr)', // 3 cards per row on larger screens
            },
            gap: '16px',
            width: '100%',
          }}
        >
          {sortedPatients.map((patient) => {
            const recentEncounter = patient.encounters[0]; // Get the most recent encounter
            const recentCondition = recentEncounter?.conditions[0];
            const recentMedication = recentEncounter?.medications[0];

            return (
              <Card
                key={patient.id}
                sx={{
                  padding: { xs: 2, sm: 2, md: 2 },
                  borderRadius: '12px',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  height: '100%',
                }}
              >
                <CardContent>
                  {/* Patient Info */}
                  <Box>
                    <Typography variant="h6">
                      {patient.firstName} {patient.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {patient.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Gender: {patient.gender}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}
                    </Typography>
                  </Box>

                  {/* Recent Encounter */}
                  {recentEncounter ? (
                    <Box mt={2}>
                      <Typography variant="subtitle1" gutterBottom>
                        Recent Encounter:
                      </Typography>
                      <Typography variant="body2">
                        Encounter Date:{' '}
                        {new Date(
                          recentEncounter.encounterDate
                        ).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2">
                        Reason: {recentEncounter.reason}
                      </Typography>
                    </Box>
                  ) : (
                    <Box mt={2}>
                      <Typography variant="subtitle1" color="text.secondary">
                        No recent encounters
                      </Typography>
                    </Box>
                  )}

                  {/* Recent Condition */}
                  {recentCondition && (
                    <Box mt={2}>
                      <Typography variant="subtitle1" gutterBottom>
                        Recent Condition:
                      </Typography>
                      <Typography variant="body2">
                        Condition Code: {recentCondition.conditionCode}
                      </Typography>
                      <Typography variant="body2">
                        Diagnosed At:{' '}
                        {new Date(
                          recentCondition.diagnosedAt
                        ).toLocaleDateString()}
                      </Typography>
                    </Box>
                  )}

                  {/* Recent Medication */}
                  {recentMedication && (
                    <Box mt={2}>
                      <Typography variant="subtitle1" gutterBottom>
                        Recent Medication:
                      </Typography>
                      <Typography variant="body2">
                        Medication: {recentMedication.medicationName}
                      </Typography>
                      <Typography variant="body2">
                        Dosage: {recentMedication.dosage}
                      </Typography>
                      <Typography variant="body2">
                        Start Date:{' '}
                        {new Date(
                          recentMedication.startDate
                        ).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2">
                        End Date:{' '}
                        {recentMedication.endDate
                          ? new Date(
                              recentMedication.endDate
                            ).toLocaleDateString()
                          : 'Ongoing'}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </Box>
      ) : (
        <Box sx={{display: 'flex', width: '100%', flexGrow: 1}}>
          <Card
            sx={{
              padding: { xs: 2, sm: 2, md: 2 },
              borderRadius: '12px',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              width: '100%',
              flexGrow: 1,
              gridColumn: 'span 1',
            }}
          >
            <CardContent>
              <Typography variant="h6">No Results</Typography>
              <Typography variant="body2" color="text.secondary">
                No patients found for your query.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Pagination Component */}
      {patients.length > 0 && (
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(totalCount / ITEMS_PER_PAGE)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </>
  );
};

export default PatientsCard;
