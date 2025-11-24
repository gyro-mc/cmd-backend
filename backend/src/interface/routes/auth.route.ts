import { Router } from "express";
import { asyncWrapper } from "../../shared/utils/asyncWrapper";
import { AuthController } from "../controllers/authController";
import { validate } from "../middlewares/Validate";
import { LoginDto } from "../../application/dto/requests/LoginDto";
import { UserAuthService } from "../../application/services/UserAuthService";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { AuthRepository } from "../../infrastructure/repositories/AuthRepository";
import { authMiddleware } from "../middlewares/authMiddleware";
import { CreateUserDtoSchema } from "../../application/dto/requests/CreateUserDto";
import { requireRole } from "../middlewares/requireRole";

const router = Router();

const userRepository = new UserRepository();
const authRepository = new AuthRepository();
const userAuthService = new UserAuthService(userRepository, authRepository);
const authController = new AuthController(userAuthService);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user with email and password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@admin.com
 *               password:
 *                 type: string
 *                 example: admin
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       description: JWT access token
 *                     refreshToken:
 *                       type: string
 *                       description: JWT refresh token
 *                     expiresIn:
 *                       type: number
 *                       description: Token expiration time in seconds
 *                     tokenType:
 *                       type: string
 *                       example: Bearer
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: User ID (UUID)
 *                         email:
 *                           type: string
 *                           format: email
 *                         firstName:
 *                           type: string
 *                         lastName:
 *                           type: string
 *                         role:
 *                           type: string
 *                           enum: [admin, doctor, receptionist]
 *                 error:
 *                   type: null
 *                   example: null
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 400
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: null
 *                   example: null
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Invalid email or password
 */
router.post(
  "/login",
  validate(LoginDto),
  asyncWrapper((req, res) => authController.login(req, res))
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     description: Logout user and invalidate session
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/logout",
  authMiddleware,
  asyncWrapper((req, res) => authController.logout(req, res))
);



/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     description: Get a new access token and refresh token using an existing refresh token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: sbr_1234567890abcdef
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     refresh_token:
 *                       type: string
 *                       description: New refresh token
 *                     access_token:
 *                       type: string
 *                       description: New access token
 *                     expires_in:
 *                       type: number
 *                       description: Token expiration time in seconds
 *                     token_type:
 *                       type: string
 *                       example: Bearer
 *                 error:
 *                   type: null
 *                   example: null
 *       401:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 401
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: null
 *                   example: null
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Invalid or expired refresh token
 */
router.post(
  "/refresh-token",

  asyncWrapper((req, res) => authController.refreshToken(req, res))
);

export default router;
