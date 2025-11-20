import { z } from 'zod';

export const CreateUserDtoSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(['admin', 'doctor', 'receptionist']),  // ✅ Added 'admin'
  password: z.string().min(2, "Password must be at least 2 characters"),  // ✅ REQUIRED, not optional!
});

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;
