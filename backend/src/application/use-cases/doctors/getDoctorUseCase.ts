import { Doctor } from "../../../domain/entities/Doctor";
import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";

export class GetDoctorUseCase {
  constructor(private doctorRepository: IDoctorRepository) {}
  async execute(id: string): Promise<Doctor | null> {
    return this.doctorRepository.getDoctorById(id);
  }
}
