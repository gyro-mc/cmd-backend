import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { asyncWrapper } from "../../shared/utils/asyncWrapper";
import { requireRole } from "../middlewares/requireRole";
import { DoctorController } from "../controllers/doctorController";
import { CreateDoctorUseCase } from "../../application/use-cases/doctors/CreateDoctorUseCase";
import { DoctorRepository } from "../../infrastructure/repositories/DoctorRepository";
import { validate } from "../middlewares/Validate";
import { CreateDoctorDtoSchema } from "../../application/dto/requests/doctors/createDoctorDto";
const router = Router();
const doctorRepository = new DoctorRepository();
const createDoctorUseCase = new CreateDoctorUseCase(doctorRepository);
const doctorsController = new DoctorController(createDoctorUseCase);

// enpoint for creating a doctor
router.post(
  "/",
  authMiddleware,
  requireRole(["admin"]),
  validate(CreateDoctorDtoSchema),
  asyncWrapper(doctorsController.createDoctor.bind(doctorsController))
);

// enpoint for getting all doctors
router.get("/", (req, res) => {
  res.send("Doctors");
});

// endpoint for getting a doctor by id
router.get("/:id", (req, res) => {
  res.send("Doctors");
});

// endpoint for updating a doctor
router.put("/:id", (req, res) => {
  res.send("Doctors");
});

// endpoint for deleting a doctor
router.delete("/:id", (req, res) => {
  res.send("Doctors");
});

export default router;
