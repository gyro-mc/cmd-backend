import { AppError } from "./AppError";
interface supabaseError {
    name: string;
    message: string;
    status: number;
    details?: string;
    hint?: string;
}

export enum DatabaseErrorType {
    INVALID_LOGIN_CREDENTIALS = "Invalid login credentials",
    USER_ALREADY_REGISTERED = "User already registered",
    PASSWORD_TOO_SHORT = "Password should be at least 6 characters",
    INVALID_TOKEN = "Invalid token",
    USER_NOT_CONFIRMED = "User not confirmed",
    RATE_LIMIT_EXCEEDED = "Too many requests",
}


export class DatabaseError extends AppError {
    status: number;
    details?: string;
    hint?: string;

    constructor(errorOrMessage?: string | supabaseError, fallbackMessage?: string) {

        const message = typeof errorOrMessage === "string"
            ? errorOrMessage
            : (errorOrMessage?.message || fallbackMessage || "Database error occurred");
        super(message);
        this.status = typeof errorOrMessage === "string" ? 500 : (errorOrMessage?.status || 500);
        this.details = typeof errorOrMessage === "string" ? undefined : errorOrMessage?.details;
        this.hint = typeof errorOrMessage === "string" ? undefined : errorOrMessage?.hint;
        this.name = "DatabaseError";
        Object.setPrototypeOf(this, AppError.prototype);

    }
}