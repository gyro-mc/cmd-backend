import { AuthError } from "../../infrastructure/errors/AuthError";
import { AppError } from "../../infrastructure/errors/AppError";
import { ErrorTypes } from "../../infrastructure/errors/ErrorTypes";
import { Logger } from "../../shared/utils/logger";
import { ValidationError } from "../../infrastructure/errors/ValidationError";
import { DatabaseError } from "../../infrastructure/errors/DatabaseError";

export const errorHandler = (err: any, req: any, res: any, next: any) => {
  // Check for AuthError first (more specific)
  if (err instanceof AuthError) {
    Logger.warn(`Auth error: ${err.message}`, {
      subErrorType: err.subErrorType,
    });
    return res.status(401).json({
      success: false,
      status: 401,
      data: null,
      error: {
        type: ErrorTypes.AuthenticationError,
        subErrorType: err.subErrorType,
        context: err.context,
        message: err.message,
      },
    });
  }

  // Check for AppError (less specific)
  if (err instanceof AppError) {
    Logger.warn(`App error: ${err.message}`, { context: err.context });
    return res.status(400).json({
      success: false,
      status: 400,
      data: null,
      error: {
        type: ErrorTypes.ValidationError,
        context: err.context,
        message: err.message,
      },
    });
  }
  if (err instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      status: 400,
      data: null,
      error: {
        type: ErrorTypes.ValidationError,
        message: err.message,
        details: err.details,
      },
    });
  }
  if (err instanceof DatabaseError) {
    Logger.warn(`Database error: ${err.message}`, {
      details: err.details,
      hint: err.hint,
    });
    return res.status(err.status).json({
      success: false,
      status: err.status,
      data: null,
      error: {
        type: ErrorTypes.DatabaseError,
        message: err.message,
        details: err.details,
        hint: err.hint,
      },
    });
  }

  // Generic error
  Logger.error("Internal server error", err);
  return res.status(500).json({
    success: false,
    status: 500,
    data: null,
    error: {
      type: ErrorTypes.InternalServerError,
      message: err?.message || "An unexpected error occurred",
    },
  });
};
