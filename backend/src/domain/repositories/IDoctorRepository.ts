import { Doctor } from "../entities/Doctor";
import { GetDoctorsList } from "../../application/dto/responses/getDoctorsList";

export interface IDoctorRepository {
  createDoctor(doctor: Doctor, password: string): Promise<Doctor>;
  getDoctorById(id: string): Promise<Doctor | null>;
  getDoctors(offset: number, limit: number): Promise<GetDoctorsList>;
  updateDoctor(doctor: Doctor): Promise<void>;
  deleteDoctor(id: string): Promise<void>;
}
