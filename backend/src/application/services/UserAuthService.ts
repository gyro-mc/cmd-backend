import { User } from "../../domain/entities/User";
import { AuthError } from "../../domain/errors/AuthError";
import { DatabaseError } from "../../domain/errors/DatabaseError";
import { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IUserAuthService } from "../../domain/services/IUserAuthService";
import { Logger } from "../../shared/utils/logger";
import { LoginResponseDto } from "../dto/responses/LoginResponseDto";

export class UserAuthService implements IUserAuthService {
   constructor(
      private userRepository: IUserRepository,
      private authRepository: IAuthRepository
   ) { }

   async loginUser(email: string, password: string): Promise<LoginResponseDto> {
      Logger.info("🔐 Login attempt", { email });

      const authResponse = await this.authRepository.login(email, password);

      // Get full user profile from database
      const profile = await this.userRepository.findByAuthUUID(authResponse.user.getId());

      if (!profile) {
         Logger.error("❌ Profile not found", { userId: authResponse.user.getId() });
         throw new DatabaseError("User profile not found");
      }

      Logger.info("✅ Login successful", { email, userId: profile.getId(), role: profile.getRole() });

      return new LoginResponseDto(
         authResponse.access_token,
         authResponse.refresh_token,
         authResponse.expires_in || 3600,
         authResponse.token_type || 'Bearer',
         profile  // Pass the User instance directly
      );
   }

   async logoutUser(userId: string): Promise<void> {
      Logger.info("🔐 Logout attempt", { userId });

      await this.authRepository.logout(userId);
   }

   async refreshToken(refreshToken: string): Promise<LoginResponseDto> {
      Logger.info("🔄 Refresh token attempt", { refreshToken });

      const authResponse = await this.authRepository.refreshToken(refreshToken);

      // Get full user profile from database
      const profile = await this.userRepository.findByAuthUUID(authResponse.user.getId());

      if (!profile) {
         Logger.error("❌ Profile not found", { userId: authResponse.user.getId() });
         throw new DatabaseError("User profile not found");
      }

      Logger.info("✅ Refresh token successful", { email: profile.getEmail(), userId: profile.getId() });

      return new LoginResponseDto(
         authResponse.access_token,
         authResponse.refresh_token,
         authResponse.expires_in || 3600,
         authResponse.token_type || 'Bearer',
         profile
      );
   }

   async createUser(user: User, password: string): Promise<User> {
      Logger.info("🔐 User creation attempt", { email: user.getEmail() });

      const createdUser = await this.userRepository.createUser(user, password);

      Logger.info("✅ User created successfully", { email: createdUser.getEmail() });

      return createdUser;
   }
}