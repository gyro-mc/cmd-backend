import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ValidationError } from "../../infrastructure/errors/ValidationError";
import { Logger } from "../../shared/utils/logger";

/**
 * Validation middleware factory using Zod
 * @param schema - Zod schema to validate against
 * @returns Middleware function
 */
export function validate(schema: ZodSchema) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      Logger.info("🔍 Starting validation", {
        endpoint: req.originalUrl,
        method: req.method,
      });

      // Parse and validate request body
      const result = schema.safeParse(req.body);

      if (!result.success) {
        // Format validation errors
        const validationDetails = result.error.issues.map((issue) => ({
          field: issue.path.join(".") || "body",
          type: issue.code,
          message: issue.message,
          received: JSON.stringify(issue.input),
        }));

        const errorMessage = result.error.issues
          .map((i) => `${i.path.join(".") || "body"}: ${i.message}`)
          .join("; ");

        Logger.warn("❌ Validation failed", {
          endpoint: req.originalUrl,
          errors: validationDetails,
        });

        // Throw validation error (will be caught by error handler)
        throw new ValidationError(errorMessage, validationDetails);
      }

      // Attach validated data to request
      req.body = result.data;

      Logger.info("✅ Validation passed", {
        endpoint: req.originalUrl,
      });

      next();
    } catch (error) {
      // Pass to error handler middleware
      next(error);
    }
  };
}
