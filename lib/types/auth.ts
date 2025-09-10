import { z } from "zod";

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

export const LoginResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number(),
  message: z.string(),
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string()
  }).optional(),
  details: z.array(z.string()).optional(),
  error: z.string().optional()
});

export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
