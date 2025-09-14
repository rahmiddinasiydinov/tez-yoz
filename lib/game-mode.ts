import { z } from "zod";
const GameModeDataSchema = z.object({
  id: z.string(),
  type: z.enum(["BY_TIME", "BY_WORD"]),
  value: z.number(),
});

const GameModeResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number(),
  message: z.string(),
  data: z
    .object({
      gameModes: z.array(GameModeDataSchema),
    })
    .optional(),
  details: z.array(z.string()).optional(),
  error: z.string().optional(),
});

export type GameModeResponse = z.infer<typeof GameModeResponseSchema>;
export type GameModeData = z.infer<typeof GameModeDataSchema>;
