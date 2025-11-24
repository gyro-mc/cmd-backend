import { Doctor } from "../entities/Doctor";

export interface IDoctorRepository {
  createDoctor(doctor: Doctor, password: string): Promise<void>;
  getDoctorById(id: string): Promise<Doctor | null>;
  getDoctors(): Promise<Doctor[]>;
  updateDoctor(doctor: Doctor): Promise<void>;
  deleteDoctor(id: string): Promise<void>;
}
