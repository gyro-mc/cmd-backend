import { Doctor } from "../../domain/entities/Doctor";
import { IDoctorRepository } from "../../domain/repositories/IDoctorRepository";
import { supabaseAdmin } from "../../infrastructure/database/supabase";
import { Logger } from "../../shared/utils/logger";
import { DatabaseError } from "../errors/DatabaseError";
export class DoctorRepository implements IDoctorRepository {
  async createDoctor(doctor: Doctor, password: string): Promise<void> {
    // create auth user
    const { data: authUser, error: AuthError } =
      await supabaseAdmin.auth.admin.createUser({
        email: doctor.getEmail(),
        password: password,
        email_confirm: true,
      });
    if (AuthError) {
      Logger.error("auth User not created", { AuthError });
      throw new DatabaseError(AuthError);
    }
    if (!authUser) {
      Logger.error("auth User not created");
      throw new DatabaseError("auth User not created");
    }
    // create profile

    const { error: ProfileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: authUser.user.id,
        email: doctor.getEmail(),
        first_name: doctor.getFirstName(),
        last_name: doctor.getLastName(),
        role: doctor.getRole(),
      });
    if (ProfileError) {
      Logger.error("Profile not created", { ProfileError });
      throw new DatabaseError(ProfileError.message);
    }
    // create doctor
    const { error } = await supabaseAdmin.from("doctors").insert({
      id: authUser.user.id,
      salary: doctor.getSalary(),
      is_medical_director: doctor.IsMedicalSupervisor(),
      specialization: doctor.getSpecialisation(),
    });
    if (error) {
      Logger.error("Doctor not created", { error });
      throw new DatabaseError(error.message);
    }
  }
  getDoctorById(id: string): Promise<Doctor | null> {
    throw new Error("Method not implemented.");
  }
  getDoctors(): Promise<Doctor[]> {
    throw new Error("Method not implemented.");
  }
  updateDoctor(doctor: Doctor): Promise<void> {
    throw new Error("Method not implemented.");
  }
  deleteDoctor(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
