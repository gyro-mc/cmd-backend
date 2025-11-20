import { Request, Response, NextFunction } from 'express';
import { AuthError } from '../../domain/errors/AuthError';
import { supabaseAdmin } from '../../infrastructure/database/supabase';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { Logger } from '../../shared/utils/logger';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    };
}

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        // 1. Check if Authorization header exists
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            const err = AuthError.invalidToken('No authorization header provided');
            return next(err);
        }

        // 2. Extract Bearer token
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            const err = AuthError.invalidToken('Invalid authorization header format');
            return next(err);
        }

        const token = parts[1];

        // 3. ✅ Verify token with Supabase admin client
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

        if (error || !user) {
            Logger.error('🔴 Token verification failed', { error: error?.message, token: token.substring(0, 20) + '...' });
            const err = AuthError.invalidToken('Invalid or expired token');
            return next(err);
        }

        Logger.debug('✅ Token verified', { userId: user.id });

        // 4. Get user profile from database using repository
        const userRepository = new UserRepository();
        const userProfile = await userRepository.findByAuthUUID(user.id);

        if (!userProfile) {
            Logger.error('🔴 User profile not found in database', { userId: user.id });
            const err = AuthError.invalidToken('User profile not found');
            return next(err);
        }

        // 5. Attach user to request
        req.user = {
            id: userProfile.getId(),
            email: userProfile.getEmail(),
            firstName: userProfile.getFirstName(),
            lastName: userProfile.getLastName(),
            role: userProfile.getRole()
        };

        Logger.info(`✅ User authenticated: ${req.user.id} (role: ${req.user.role})`);
        next();
    } catch (error) {
        Logger.error('🔴 Auth middleware error', { error });
        const err = AuthError.invalidToken('Authentication failed');
        next(err);
    }
};

