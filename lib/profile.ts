import { z } from "zod";

const UserProfileResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number(),
  message: z.string(),
  data: z
    .object({
      id: z.string(),
      email: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      username: z.string(),
      createdAt: z.string(),
      updatedAt: z.string(),
    })
    .optional(),
  details: z.array(z.string()),
  error: z.string(),
});

export type UserProfileResponse = z.infer<typeof UserProfileResponseSchema>;
