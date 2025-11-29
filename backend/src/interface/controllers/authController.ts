import { Request, Response } from "express";
import { UserAuthService } from "../../application/services/UserAuthService";
import { AuthRequest } from "../middlewares/authMiddleware";

export class AuthController {
  constructor(private userAuthService: UserAuthService) {}

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const result = await this.userAuthService.loginUser(email, password);

    // Set access token in HTTP-only cookie (1 hour expiration)
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
      path: "/",
    });

    // Set refresh token in HTTP-only cookie (7 days expiration)
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/api/auth/refresh-token",
    });

    // Return response with only user info (no tokens)
    const responseJson = result.toJSON();
    const { refreshToken, accessToken, ...dataWithoutTokens } =
      responseJson.data;

    res.json({
      status: 200,
      success: true,
      data: dataWithoutTokens,
      error: null,
    });
  }

  async logout(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    await this.userAuthService.logoutUser(userId);

    // Clear access token cookie
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

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

    // Set new access token in cookie (1 hour expiration)
    res.cookie("accessToken", result["access_token"], {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
      path: "/",
    });

    // Set new refresh token in cookie (7 days expiration)
    res.cookie("refreshToken", result["refresh_token"], {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/api/auth/refresh-token",
    });

    // Return minimal response (no tokens in body)
    res.json({
      status: 200,
      success: true,
      data: { message: "Tokens refreshed successfully" },
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
