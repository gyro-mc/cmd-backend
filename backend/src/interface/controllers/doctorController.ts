import { Request, Response } from "express";
import { ApiResponse } from "../../application/dto/responses/ApiResponse";
import { CreateDoctorUseCase } from "../../application/use-cases/doctors/CreateDoctorUseCase";
import { success } from "zod";
import { AuthRequest } from "../middlewares/authMiddleware";
import { GetDoctorsListUseCase } from "../../application/use-cases/doctors/GetAllDoctorsUseCase";
import { GetDoctorUseCase } from "../../application/use-cases/doctors/getDoctorUseCase";

export class DoctorController {
  constructor(
    private createDoctorUseCase: CreateDoctorUseCase,
    private getDoctorsUseCase: GetDoctorsListUseCase,
    private getDoctorUseCase: GetDoctorUseCase
  ) {}
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
  async getDoctors(req: AuthRequest, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const response = await this.getDoctorsUseCase.execute(page, limit);
    res.status(200).json({
      success: true,
      status: res.status,
      data: response,
      error: null,
    });
  }
  async getDoctorByid(req: AuthRequest, res: Response) {
    const id = req.params.id;
    const response = await this.getDoctorUseCase.execute(id);
    res.status(200).json({
      success: true,
      status: res.status,
      data: response,
      error: null,
    });
  }
}
