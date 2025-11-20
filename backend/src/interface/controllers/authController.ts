import { Request, Response } from "express";
import { UserAuthService } from "../../application/services/UserAuthService";
import { AuthRequest } from "../middlewares/authMiddleware";
import { User } from "../../domain/entities/User";

export class AuthController {
    constructor(private userAuthService: UserAuthService) { }



    async login(req: Request, res: Response) {
        const { email, password } = req.body;
        const result = await this.userAuthService.loginUser(email, password);

        res.json(result.toJSON());
    }

    async logout(req: AuthRequest, res: Response) {
        const userId = req.user?.id;
        await this.userAuthService.logoutUser(userId);
        res.json({
            status: 200,
            success: true,
            data: { message: 'Logged out successfully' }
        });
    }
    async createUser(req: Request, res: Response) {
        const { email, password, firstName, lastName, role } = req.body;

        // ✅ Create a User instance from request body
        const user = new User(
            '', // Empty ID for new users (will be assigned during creation)
            email,
            firstName,
            lastName,
            role,
        );

        // ✅ Set password on user (if your User class has this method)
        // If not, modify User to accept password in constructor

        const result = await this.userAuthService.createUser(user, password);

        res.json({
            status: 201,
            success: true,
            data: result.toJSON()
        });

    }
}