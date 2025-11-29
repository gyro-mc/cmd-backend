import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";
import { GetDoctorsList } from "../../dto/responses/getDoctorsList";

export class GetDoctorsListUseCase {
  constructor(private doctorRepository: IDoctorRepository) {}

  async execute(page: number, limit: number): Promise<GetDoctorsList> {
    const offset = (page - 1) * limit;
    return this.doctorRepository.getDoctors(offset, limit);
  }
}
