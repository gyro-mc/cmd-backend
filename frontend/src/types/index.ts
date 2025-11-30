// Patient Types
export interface Patient {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  profession: string;
  childrenNumber: number;
  familySituation: string;
  birthDate: string;
  gender: string;
  insuranceNumber?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  allergies?: string[];
  currentMedications?: string[];
  createdAt?: string;
  updatedAt?: string;
  // Medical file data (if included in response)
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
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phoneNumber: string;
  profession: string;
  childrenNumber: number;
  familySituation: string;
  birthDate: string;
  gender: string;
  insuranceNumber?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
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
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  salary: number;
  isMedicalDirector: boolean;
  specialization: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DoctorFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  salary: number;
  isMedicalDirector?: boolean;
  specialization: string;
}

// Appointment Types
export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  roomId?: number;
  createdByReceptionistId?: string;
  createdByDoctorId?: string;
  appointmentDate: string;
  estimatedDuration: number; // in minutes
  actualDuration?: number;
  status: "scheduled" | "in-progress" | "completed" | "cancelled" | "no-show";
  notes?: string;
  reasonForVisit?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppointmentFormData {
  patientId: number;
  doctorId: number;
  roomId?: number;
  appointmentDate: string;
  estimatedDuration: number;
  status?: "scheduled" | "in-progress" | "completed" | "cancelled" | "no-show";
  notes?: string;
  reasonForVisit?: string;
}

export interface AppointmentWithDetails extends Appointment {
  doctorName: string;
  patientName: string;
  roomNumber?: string;
}

// API Response Types
export interface ApiSuccessResponse<T = any> {
  success: true;
  status: number;
  data: T;
  error: null;
}

export interface ApiErrorResponse {
  success: false;
  status: number;
  data: null;
  error: {
    type: string;
    subErrorType?: string;
    context?: any;
    message: string;
    details?: any;
    hint?: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
