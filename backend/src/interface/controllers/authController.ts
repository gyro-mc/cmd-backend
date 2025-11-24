import { Request, Response } from "express";
import { UserAuthService } from "../../application/services/UserAuthService";
import { AuthRequest } from "../middlewares/authMiddleware";
import { User } from "../../domain/entities/User";

export class AuthController {
  constructor(private userAuthService: UserAuthService) {}

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
      data: { message: "Logged out successfully" },
      error: null,
    });
  }
  
  async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body;
    const result = await this.userAuthService.refreshToken(refreshToken);

    res.json({
      status: 200,
      success: true,
      data: result.toJSON(),
      error: null,
    });
  }
}
