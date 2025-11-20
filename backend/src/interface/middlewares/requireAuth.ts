import { AuthError } from "../../domain/errors/AuthError";
import { NextFunction, Request, Response } from "express";
import { Logger } from "../../shared/utils/logger";
import { AuthRequest } from "./authMiddleware";

// Role-based access control middleware
export const requireRole = (allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            const err = AuthError.invalidToken('User not authenticated');
            return next(err);
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
            });
        }

        Logger.info(`User ${req.user.id} authorized for role: ${req.user.role}`);
        next();
    };
};
