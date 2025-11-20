import { z } from 'zod';

export const RefreshTokenDtoSchema = z.object({
    refresh_token: z.string().nonempty(),
});

export type RefreshTokenDto = z.infer<typeof RefreshTokenDtoSchema>;