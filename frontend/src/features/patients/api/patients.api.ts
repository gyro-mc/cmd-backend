import axiosInstance from "../../../lib/axios";
import type { Patient, PatientFormData } from "../../../types";

const mockPatient: Patient = {
  id: "1",
  patient_id: "HD-2024-1234",
  name: "John Doe",
  address: "123 Main St, City, State 12345",
  phone_number: "+1 (555) 111-2222",
  profession: "Engineer",
  children_number: 2,
  family_situation: "Married",
  birth_date: "1985-03-15",
};

export const getPatients = async (): Promise<Patient[]> => {
  // Return mock data
  return new Promise((resolve) => {
    setTimeout(() => resolve([mockPatient]), 300);
  });

  // const response = await axiosInstance.get("/patients");
  // return response.data;
};

export const getPatientById = async (_id: string): Promise<Patient> => {
  // Return mock data
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockPatient), 300);
  });

  // const response = await axiosInstance.get(`/patients/${id}`);
  // return response.data;
};

export const createPatient = async (
  data: PatientFormData
): Promise<Patient> => {
  const response = await axiosInstance.post("/patients", data);
  return response.data;
};

export const updatePatient = async (
  id: string,
  data: Partial<PatientFormData>
): Promise<Patient> => {
  const response = await axiosInstance.put(`/patients/${id}`, data);
  return response.data;
};

export const deletePatient = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/patients/${id}`);
};
