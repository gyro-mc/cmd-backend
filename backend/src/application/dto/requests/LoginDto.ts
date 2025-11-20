import { z } from 'zod';

export const LoginDto = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(2, 'Password must be at least 2 characters'),
});

export type LoginDtoType = z.infer<typeof LoginDto>;
