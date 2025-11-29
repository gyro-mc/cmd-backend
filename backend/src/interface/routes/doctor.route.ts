import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { asyncWrapper } from "../../shared/utils/asyncWrapper";
import { requireRole } from "../middlewares/requireRole";
import { DoctorController } from "../controllers/doctorController";
import { CreateDoctorUseCase } from "../../application/use-cases/doctors/CreateDoctorUseCase";
import { DoctorRepository } from "../../infrastructure/repositories/DoctorRepository";
import { validate } from "../middlewares/Validate";
import { CreateDoctorDtoSchema } from "../../application/dto/requests/doctors/createDoctorDto";
import { GetDoctorsListUseCase } from "../../application/use-cases/doctors/GetAllDoctorsUseCase";
import { GetDoctorUseCase } from "../../application/use-cases/doctors/getDoctorUseCase";
const router = Router();
const doctorRepository = new DoctorRepository();
const getAllDoctorsUseCase = new GetDoctorsListUseCase(doctorRepository);
const createDoctorUseCase = new CreateDoctorUseCase(doctorRepository);
const getDoctorUseCase = new GetDoctorUseCase(doctorRepository);
const doctorsController = new DoctorController(
  createDoctorUseCase,
  getAllDoctorsUseCase,
  getDoctorUseCase
);

/**
 * @swagger
 * components:
 *   schemas:
 *     Doctor:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *         - role
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the doctor
 *         firstName:
 *           type: string
 *           description: The first name of the doctor
 *         lastName:
 *           type: string
 *           description: The last name of the doctor
 *         email:
 *           type: string
 *           description: The email of the doctor
 *         role:
 *           type: string
 *           description: The role of the user (must be DOCTOR)
 *         salary:
 *           type: number
 *           description: The salary of the doctor
 *         isMedicalDirector:
 *           type: boolean
 *           description: Whether the doctor is a medical director
 *         specialization:
 *           type: string
 *           description: The specialization of the doctor
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the doctor was added
 *       example:
 *         firstName: Gregory
 *         lastName: House
 *         email: house@princeton.edu
 *         role: DOCTOR
 *         salary: 250000
 *         isMedicalDirector: true
 *         specialization: Diagnostician
 */

/**
 * @swagger
 * tags:
 *   name: Doctors
 *   description: The doctors managing API
 */

/**
 * @swagger
 * /doctors:
 *   post:
 *     summary: Create a new doctor
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Doctor'
 *     responses:
 *       201:
 *         description: The doctor was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: number
 *                   example: 201
 *                 data:
 *                   $ref: '#/components/schemas/Doctor'
 *                 error:
 *                   type: null
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.post(
  "/",
  authMiddleware,
  requireRole(["admin"]),
  validate(CreateDoctorDtoSchema),
  asyncWrapper(doctorsController.createDoctor.bind(doctorsController))
);

/**
 * @swagger
 * /doctors:
 *   get:
 *     summary: Returns the list of all doctors
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of items per page
 *     responses:
 *       200:
 *         description: The list of the doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     doctors:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Doctor'
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                 error:
 *                   type: null
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get(
  "/",
  authMiddleware,
  requireRole(["admin"]),
  asyncWrapper(doctorsController.getDoctors.bind(doctorsController))
);

/**
 * @swagger
 * /doctors/{id}:
 *   get:
 *     summary: Get the doctor by id
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The doctor id
 *     responses:
 *       200:
 *         description: The doctor description by id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/Doctor'
 *                 error:
 *                   type: null
 *       404:
 *         description: The doctor was not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get(
  "/:id",
  authMiddleware,
  requireRole(["admin"]),
  asyncWrapper(doctorsController.getDoctorByid.bind(doctorsController))
);

/**
 * @swagger
 * /doctors/{id}:
 *   put:
 *     summary: Update the doctor by the id
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The doctor id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Doctor'
 *     responses:
 *       200:
 *         description: The doctor was updated
 *       404:
 *         description: The doctor was not found
 *       501:
 *         description: Not Implemented
 */
router.put("/:id", (req, res) => {
  res.status(501).json({ message: "Not Implemented" });
});

/**
 * @swagger
 * /doctors/{id}:
 *   delete:
 *     summary: Remove the doctor by id
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The doctor id
 *     responses:
 *       200:
 *         description: The doctor was deleted
 *       404:
 *         description: The doctor was not found
 *       501:
 *         description: Not Implemented
 */
router.delete("/:id", (req, res) => {
  res.status(501).json({ message: "Not Implemented" });
});

export default router;
