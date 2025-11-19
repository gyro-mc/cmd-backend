import { Request, Response, NextFunction } from "express";
import { AuthError } from "../../domain/errors/AuthError";
import { supabase } from "../../infrastructure/database/supabase";
import { Logger } from "../../shared/utils/logger";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            Logger.warn('Missing or invalid authorization header');
            return next(AuthError.invalidToken());
        }

        const token = authHeader.replace('Bearer ', '');
        
        const { data, error } = await supabase.auth.getUser(token);
        
        if (error || !data.user) {
            Logger.warn('Unauthorized access attempt');
            return next(AuthError.unauthorized({ token: token.substring(0, 10) }));
        }

        Logger.info('User authenticated', { userId: data.user.id });
        (req as any).user = data.user;
        next();
    } catch (error) {
        Logger.error('Auth middleware error', error);
        next(error);
    }
};