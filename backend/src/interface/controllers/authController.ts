import { Request, Response } from "express";
import { UserAuthService } from "../../application/services/UserAuthService";
import { AuthRequest } from "../middlewares/authMiddleware";
import { User } from "../../domain/entities/User";

export class AuthController {
  constructor(private userAuthService: UserAuthService) {}

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const result = await this.userAuthService.loginUser(email, password);

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/api/auth/refresh-token",
    });

    // Return response without refresh token in body
    const responseJson = result.toJSON();
    const { refreshToken, ...dataWithoutRefreshToken } = responseJson.data;

    res.json({
      status: 200,
      success: true,
      data: dataWithoutRefreshToken,
      error: null,
    });
  }

  async logout(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    await this.userAuthService.logoutUser(userId);

    // Clear refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth/refresh-token",
    });

    res.json({
      status: 200,
      success: true,
      data: { message: "Logged out successfully" },
      error: null,
    });
  }

  async refreshToken(req: Request, res: Response) {
    // Get refresh token from cookie instead of body
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        status: 401,
        success: false,
        data: null,
        error: {
          type: "AuthenticationError",
          message: "Refresh token not found",
        },
      });
    }

    const result = await this.userAuthService.refreshToken(refreshToken);

    // Set new refresh token in cookie
    res.cookie("refreshToken", result["refresh_token"], {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/api/auth/refresh-token",
    });

    // Return response without refresh token in body
    const responseJson = result.toJSON();
    const { refresh_token, ...dataWithoutRefreshToken } = responseJson.data;

    res.json({
      status: 200,
      success: true,
      data: dataWithoutRefreshToken,
      error: null,
    });
  }

  async getMe(req: AuthRequest, res: Response) {
    const { token, ...userWithoutToken } = req.user || {};
    res.json({
      status: 200,
      success: true,
      data: userWithoutToken,
      error: null,
    });
  }
}
