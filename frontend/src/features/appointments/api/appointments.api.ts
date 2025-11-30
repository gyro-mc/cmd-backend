import axiosInstance from "../../../lib/axios";
import type {
  Appointment,
  AppointmentFormData,
  AppointmentWithDetails,
} from "../../../types";

export const getAppointments = async (): Promise<AppointmentWithDetails[]> => {
  const response = await axiosInstance.get("/appointments");
  return response.data;
};

export const getAppointmentById = async (
  id: number
): Promise<AppointmentWithDetails> => {
  const response = await axiosInstance.get(`/appointments/${id}`);
  return response.data;
};

export const createAppointment = async (
  data: AppointmentFormData
): Promise<Appointment> => {
  const response = await axiosInstance.post("/appointments", data);
  return response.data;
};

export const updateAppointment = async (
  id: number,
  data: Partial<AppointmentFormData>
): Promise<Appointment> => {
  const response = await axiosInstance.put(`/appointments/${id}`, data);
  return response.data;
};

export const deleteAppointment = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/appointments/${id}`);
};
