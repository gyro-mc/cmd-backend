import { AuthError } from "../../domain/errors/AuthError";
import { AppError } from "../../domain/errors/AppError";
import { ErrorTypes } from "../../domain/errors/ErrorTypes";
import { Logger } from "../../shared/utils/logger";
import { ValidationError } from "../../domain/errors/ValidationError";
import { DatabaseError } from "../../domain/errors/DatabaseError";

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
    if (err instanceof ValidationError) {
        return res.status(400).json(
            {
                success: false,
                errorType: ErrorTypes.ValidationError,
                UserMessage: err.message,
                data: null,
                details: err.details,
            },
        );
    }
    if (err instanceof DatabaseError) {
        Logger.warn(`Database error: ${err.message}`, { details: err.details, hint: err.hint });
        return res.status(err.status).json({
            success: false,
            data: null,
            ErrorType: ErrorTypes.DatabaseError,
            UserMessage: err.message,
            details: err.details,
            hint: err.hint,
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