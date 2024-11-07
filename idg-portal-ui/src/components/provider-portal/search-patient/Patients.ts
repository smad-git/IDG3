export interface Patient {
    id: string;
    patientId: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    dateOfBirth: string;
    status: string;
    race: string;
    address: string;
    createdAt: string;
    encounters: Encounter[];
  }
  
  export interface Encounter {
    encounterId: string;
    encounterDate: string;
    reason: string;
    conditions: Condition[];
    medications: Medication[];
  }
  
  export interface Condition {
    conditionId: string;
    conditionCode: string;
    diagnosedAt: string;
  }
  
  export interface Medication {
    medicationId: string;
    medicationName: string;
    dosage: string;
    startDate: string;
    endDate: string;
  }
  
  export interface PatientsListProps {
    patients: Patient[];
    totalCount: number;
    page: number;
    onPageChange: (page: number) => void;
  }

  export interface PatientsPaginationProps {
    currentPage: number;
    totalCount: number;
    itemsPerPage: number;
    onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  }