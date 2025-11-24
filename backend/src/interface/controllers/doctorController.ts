import { Response } from "express";
import { ApiResponse } from "../../application/dto/responses/ApiResponse";
import { CreateDoctorUseCase } from "../../application/use-cases/doctors/CreateDoctorUseCase";
import { success } from "zod";
import { AuthRequest } from "../middlewares/authMiddleware";

export class DoctorController {
  constructor(private createDoctorUseCase: CreateDoctorUseCase) {}
  async createDoctor(req: AuthRequest, res: Response) {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      salary,
      isMedicalDirector,
      specialization,
    } = req.body;
    const response = await this.createDoctorUseCase.execute({
      firstName,
      lastName,
      email,
      password,
      role,
      salary,
      isMedicalDirector,
      specialization,
    });
    res.status(201).json({
      success: true,
      status: res.status,
      data: response,
      error: null,
    });
  }
}
