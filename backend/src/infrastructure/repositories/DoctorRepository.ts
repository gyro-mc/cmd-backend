import { Doctor } from "../../domain/entities/Doctor";
import { IDoctorRepository } from "../../domain/repositories/IDoctorRepository";
import { supabaseAdmin } from "../../infrastructure/database/supabase";
import { Logger } from "../../shared/utils/logger";
import { DatabaseError } from "../errors/DatabaseError";
import { GetDoctorsList } from "../../application/dto/responses/getDoctorsList";
export class DoctorRepository implements IDoctorRepository {
  async createDoctor(doctor: Doctor, password: string): Promise<Doctor> {
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
    return doctor;
  }
  async getDoctorById(id: string): Promise<Doctor | null> {
    // Fetch doctor with profile information using join
    const { data, error } = await supabaseAdmin
      .from("doctors")
      .select(
        `
        id,
        specialization,
        salary,
        is_medical_director,
        profiles!inner (
          first_name,
          last_name,
          email,
          role
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      Logger.error("Doctor not fetched", { error });
      throw new DatabaseError(error.message);
    }

    if (!data) {
      return null;
    }

    // Type assertion for profiles since Supabase returns it as an object, not array
    const profile = data.profiles as unknown as {
      first_name: string;
      last_name: string;
      email: string;
      role: string;
    };

    // Create Doctor entity from the fetched data
    const doctor = new Doctor(
      data.id,
      profile.email,
      profile.first_name,
      profile.last_name,
      data.specialization
    );

    // Set additional properties
    doctor.setSpecialisation(data.specialization);
    doctor.setSalary(data.salary);
    doctor.setIsMedicalSupervisor(data.is_medical_director);

    return doctor;
  }
  async getDoctors(offset: number, limit: number): Promise<GetDoctorsList> {
    // Get total count of doctors
    const { count, error: countError } = await supabaseAdmin
      .from("doctors")
      .select("*", { count: "exact", head: true });

    if (countError) {
      Logger.error("Failed to get doctors count", { countError });
      throw new DatabaseError(countError.message);
    }

    // Fetch doctors with profile information using join
    const { data, error } = await supabaseAdmin
      .from("doctors")
      .select(
        `
        id,
        specialization,
        profiles!inner (
          first_name,
          last_name,
          email
        )
      `
      )
      .range(offset, offset + limit - 1);

    if (error) {
      Logger.error("Doctors not fetched", { error });
      throw new DatabaseError(error.message);
    }

    // Transform the data to match GetDoctorsList interface
    const doctors = (data || []).map((doctor: any) => {
      // profiles is a single object due to !inner join, not an array
      const profile = doctor.profiles as unknown as {
        first_name: string;
        last_name: string;
        email: string;
      };
      return {
        id: doctor.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        specialization: doctor.specialization,
      };
    });

    return {
      total: count || 0,
      doctors,
    };
  }
  updateDoctor(doctor: Doctor): Promise<void> {
    throw new Error("Method not implemented.");
  }
  deleteDoctor(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
