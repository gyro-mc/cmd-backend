// Patient Types
export interface Patient {
  id: string;
  patient_id?: string;
  name: string;
  address: string;
  phone_number: string;
  profession: string;
  children_number: number;
  family_situation: string;
  birth_date: string;
  medicalInfo?: {
    initialNephropathy?: string;
    firstDialysisDate?: string;
    careStartDate?: string;
    vascularAccess?: VascularAccess[];
    vaccinations?: Vaccination[];
    dialysisProtocol?: DialysisProtocol;
    medications?: Medication[];
    labResults?: LabResult[];
    clinicalSummary?: string;
  };
}

export interface PatientFormData {
  name: string;
  address: string;
  phone_number: string;
  profession: string;
  children_number: number;
  family_situation: string;
  birth_date: string;
}

export interface VascularAccess {
  type: string;
  site: string;
  operator: string;
  firstUseDate: string;
  creationDates: string[];
}

export interface Vaccination {
  vaccineName: string;
  doses: {
    doseNumber: number;
    date: string;
    reminderDate?: string;
  }[];
}

export interface DialysisProtocol {
  dialysisDays: string[];
  sessionsPerWeek: number;
  generator: string;
  sessionDuration: string;
  dialyser: string;
  needle: string;
  bloodFlow: string;
  anticoagulation: string;
  dryWeight: string;
  interDialyticWeightGain: string;
  incidents: string[];
}

export interface Medication {
  name: string;
  history: {
    startDate: string;
    dosage: string;
  }[];
}

export interface LabResult {
  date: string;
  parameters: {
    [key: string]: string;
  };
}

// Doctor Types
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  phone_number: string;
  email: string;
}

export interface DoctorFormData {
  name: string;
  specialty: string;
  phone_number: string;
  email: string;
}

// Appointment Types
export interface Appointment {
  id: number;
  created_at?: string;
  date: string;
  estimated_duration?: string;
  doctor_id: string;
  patient_id: string;
  room_number?: number;
  status?: string;
  reason?: string;
}

export interface AppointmentFormData {
  doctor_id: string;
  patient_id: string;
  date: string;
  estimated_duration: string;
  room_number: number;
  reason: string;
  status: string;
}

export interface AppointmentWithDetails extends Appointment {
  doctor_name: string;
  patient_name: string;
}
