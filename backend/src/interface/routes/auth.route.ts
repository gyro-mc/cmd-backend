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
 *         description: Login successful - Access and refresh tokens set in HTTP-only cookies
 *         headers:
 *           Set-Cookie:
 *             description: Access token (1 hour) and refresh token (7 days) stored in HTTP-only cookies
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example:
 *                 - accessToken=jwt_access_token; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600
 *                 - refreshToken=jwt_refresh_token; Path=/api/auth/refresh-token; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
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
 *     description: Logout user, invalidate session, and clear refresh token cookie
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful - Both access and refresh token cookies cleared
 *         headers:
 *           Set-Cookie:
 *             description: Clears both access and refresh token cookies
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example:
 *                 - accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT
 *                 - refreshToken=; Path=/api/auth/refresh-token; Expires=Thu, 01 Jan 1970 00:00:00 GMT
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
 *     description: Get a new access token and refresh token using the refresh token stored in HTTP-only cookie
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: cookie
 *         name: refreshToken
 *         required: true
 *         schema:
 *           type: string
 *         description: Refresh token stored in HTTP-only cookie
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully - New access and refresh tokens set in HTTP-only cookies
 *         headers:
 *           Set-Cookie:
 *             description: New access token (1 hour) and refresh token (7 days) stored in HTTP-only cookies
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example:
 *                 - accessToken=jwt_new_access_token; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600
 *                 - refreshToken=jwt_new_refresh_token; Path=/api/auth/refresh-token; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
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
 *                     message:
 *                       type: string
 *                       example: Tokens refreshed successfully
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

/**
 * @swagger
 * /auth/me:
 *   post:
 *     summary: Get current user information
 *     description: Retrieve the authenticated user's profile information
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
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
 *                     id:
 *                       type: string
 *                       description: User ID (UUID)
 *                       example: c0b837f3-5a95-44b6-bb60-7aeccc4afe9f
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: user@example.com
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     role:
 *                       type: string
 *                       enum: [admin, doctor, receptionist]
 *                       example: doctor
 *                 error:
 *                   type: null
 *                   example: null
 *       401:
 *         description: Unauthorized - Invalid or missing token
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
 *                       example: Invalid or expired token
 */
router.post(
  "/me",
  authMiddleware,
  asyncWrapper((req, res) => authController.getMe(req, res))
);

export default router;
