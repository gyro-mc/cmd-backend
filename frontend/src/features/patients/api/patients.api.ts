import axiosInstance from "../../../lib/axios";
import type { Patient, PatientFormData } from "../../../types";

export const getPatients = async (): Promise<Patient[]> => {
  const response = await axiosInstance.get("/patients");
  return response.data;
};

export const getPatientById = async (id: number): Promise<Patient> => {
  const response = await axiosInstance.get(`/patients/${id}`);
  return response.data;
};

export const createPatient = async (
  data: PatientFormData
): Promise<Patient> => {
  const response = await axiosInstance.post("/patients", data);
  return response.data;
};

export const updatePatient = async (
  id: number,
  data: Partial<PatientFormData>
): Promise<Patient> => {
  const response = await axiosInstance.put(`/patients/${id}`, data);
  return response.data;
};

export const deletePatient = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/patients/${id}`);
};
