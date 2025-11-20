import { User } from "../../../domain/entities/User";

export class LoginResponseDto {
    constructor(
        public accessToken: string,
        public refreshToken: string,
        public expiresIn: number,
        public tokenType: string,
        public user: User
    ) { }

    toJSON() {
        return {
            status: 200,
            success: true,
            data: {
                accessToken: this.accessToken,
                refreshToken: this.refreshToken,
                expiresIn: this.expiresIn,
                tokenType: this.tokenType,
                user: {
                    id: this.user.getId(),
                    email: this.user.getEmail(),
                    firstName: this.user.getFirstName(),
                    lastName: this.user.getLastName(),
                    role: this.user.getRole()
                }
            }
        };
    }
}
