import { AuthError } from "../../domain/errors/AuthError";
import { AppError } from "../../domain/errors/AppError";
import { ErrorTypes } from "../../domain/errors/ErrorTypes";
import { Logger } from "../../shared/utils/logger";

export const errorHandler = (err: any, req: any, res: any, next: any) => {
    // Check for AuthError first (more specific)
    if (err instanceof AuthError) {
        Logger.warn(`Auth error: ${err.message}`, { subErrorType: err.subErrorType });
        return res.status(401).json({
            success: false,
            data: null,
            ErrorType: ErrorTypes.AuthenticationError,
            subErrorType: err.subErrorType,
            context: err.context,
            UserMessage: err.message,
        });
    }

    // Check for AppError (less specific)
    if (err instanceof AppError) {
        Logger.warn(`App error: ${err.message}`, { context: err.context });
        return res.status(400).json({
            success: false,
            data: null,
            ErrorType: ErrorTypes.ValidationError,
            context: err.context,
            UserMessage: err.message,
        });
    }

    // Generic error
    Logger.error('Internal server error', err);
    return res.status(500).json({
        success: false,
        data: null,
        ErrorType: ErrorTypes.InternalServerError,
        UserMessage: err?.message || 'An unexpected error occurred',
    });
};