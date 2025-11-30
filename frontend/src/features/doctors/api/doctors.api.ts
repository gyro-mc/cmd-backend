import axiosInstance from "../../../lib/axios";
import type { Doctor, DoctorFormData } from "../../../types";

export const getDoctors = async (): Promise<Doctor[]> => {
  const response = await axiosInstance.get("/doctors");
  return response.data;
};

export const getDoctorById = async (id: number): Promise<Doctor> => {
  const response = await axiosInstance.get(`/doctors/${id}`);
  return response.data;
};

export const createDoctor = async (data: DoctorFormData): Promise<Doctor> => {
  const response = await axiosInstance.post("/doctors", data);
  return response.data;
};

export const updateDoctor = async (
  id: number,
  data: Partial<DoctorFormData>
): Promise<Doctor> => {
  const response = await axiosInstance.put(`/doctors/${id}`, data);
  return response.data;
};

export const deleteDoctor = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/doctors/${id}`);
};
