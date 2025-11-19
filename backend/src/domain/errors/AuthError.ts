import { AppError } from "./AppError";
enum AuthErrorType {
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
    USER_NOT_FOUND = "USER_NOT_FOUND",
    USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS",
    TOKEN_EXPIRED = "TOKEN_EXPIRED",
    INVALID_TOKEN = "INVALID_TOKEN",
    UNAUTHORIZED = "UNAUTHORIZED",
    FORBIDDEN = "FORBIDDEN",
    PASSWORD_MISMATCH = "PASSWORD_MISMATCH",
    EMAIL_NOT_VERIFIED = "EMAIL_NOT_VERIFIED",
    ACCOUNT_LOCKED = "ACCOUNT_LOCKED",
}
export class AuthError extends AppError {
    public subErrorType: AuthErrorType;
    
    private constructor(message: string, context?: any, subErrorType?: AuthErrorType) {
        super(message, context);
        this.subErrorType = subErrorType;
        
        // Maintain proper prototype chain for instanceof checks
        Object.setPrototypeOf(this, AuthError.prototype);
    }
    static invalidCredentials(context?: any) {
        return new AuthError("Invalid credentials provided.", context, AuthErrorType.INVALID_CREDENTIALS);
    }
    static userNotFound(context?: any) {
        return new AuthError("User not found.", context, AuthErrorType.USER_NOT_FOUND);
    }
    static userAlreadyExists(context?: any) {
        return new AuthError("User already exists.", context, AuthErrorType.USER_ALREADY_EXISTS);
    }
    static tokenExpired(context?: any) {
        return new AuthError("Authentication token has expired.", context, AuthErrorType.TOKEN_EXPIRED);
    }
    static invalidToken(context?: any) {
        return new AuthError("Invalid authentication token.", context, AuthErrorType.INVALID_TOKEN);
    }
    static unauthorized(context?: any) {
        return new AuthError("Unauthorized access.", context, AuthErrorType.UNAUTHORIZED);
    }
    static forbidden(context?: any) {
        return new AuthError("Forbidden access.", context, AuthErrorType.FORBIDDEN);
    }
    static passwordMismatch(context?: any) {
        return new AuthError("Password does not match.", context, AuthErrorType.PASSWORD_MISMATCH);
    }
    static emailNotVerified(context?: any) {
        return new AuthError("Email address is not verified.", context, AuthErrorType.EMAIL_NOT_VERIFIED);
    }
    static accountLocked(context?: any) {
        return new AuthError("Account is locked.", context, AuthErrorType.ACCOUNT_LOCKED);
    }   
}


