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
import { requireRole } from "../middlewares/requireAuth";

const router = Router();

// ✅ Create instances (Dependency Injection)
const userRepository = new UserRepository();
const authRepository = new AuthRepository();
const userAuthService = new UserAuthService(userRepository, authRepository);
const authController = new AuthController(userAuthService);



router.post(
    "/login",
    validate(LoginDto),
    asyncWrapper((req, res) => authController.login(req, res))
);

router.post(
    "/logout",
    authMiddleware,
    asyncWrapper((req, res) => authController.logout(req, res))
);

router.post(
    "/create-user",
    authMiddleware,
    requireRole(['admin']),
    validate(CreateUserDtoSchema),
    asyncWrapper((req, res) => authController.createUser(req, res))
)

export default router;