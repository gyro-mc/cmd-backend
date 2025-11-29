import { Doctor } from "../../../domain/entities/Doctor";
import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";
import { createDoctorDto } from "../../dto/requests/doctors/createDoctorDto";
import { randomUUID } from "crypto";

export class CreateDoctorUseCase {
  constructor(private doctorRepository: IDoctorRepository) {}

  async execute(doctorData: createDoctorDto) {
    // Generate a unique ID for the new doctor
    const doctorId = randomUUID();

    // Create the Doctor entity with the 5 required arguments
    const doctor = new Doctor(
      doctorId,
      doctorData.email,
      doctorData.firstName,
      doctorData.lastName,
      doctorData.specialization || "general" // Use specialization from DTO or default to "general"
    );

    // Set optional properties if provided
    if (doctorData.isMedicalDirector !== undefined) {
      doctor.setIsMedicalSupervisor(doctorData.isMedicalDirector);
    }

    if (doctorData.specialization) {
      doctor.setSpecialisation(doctorData.specialization);
    }

    // Pass the doctor entity and password to the repository
    const createdDoctor = await this.doctorRepository.createDoctor(
      doctor,
      doctorData.password
    );
    return createdDoctor;
  }
}
