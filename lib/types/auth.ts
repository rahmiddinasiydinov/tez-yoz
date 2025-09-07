import { z } from 'zod';

export const RegisterResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number(),
  message: z.string(),
  data: z.object({
    user: z.object({
      id: z.string().uuid(),
      email: z.string().email(),
    }),
  }),
});

export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
