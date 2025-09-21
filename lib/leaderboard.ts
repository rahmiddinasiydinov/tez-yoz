import { z } from "zod";

const bestAttemptSchema = z.object({
  wpm: z.number(),
  accuracy: z.number(),
  date: z.string(),
}); // Since it's an empty object for now

const leaderboardItemSchema = z.object({
  rank: z.number(),
  username: z.string(),
  value: z.number(),
  attempts: z.number(),
  bestAttempt: bestAttemptSchema,
  isCurrentUser: z.boolean(),
});

const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

const gameModeSchema = z.object({
  id: z.string(),
  type: z.string(),
  value: z.number(),
});

const contextSchema = z.object({
  type: z.string(),
  gameMode: gameModeSchema,
  language: z.string(),
  period: z.string(),
  metric: z.string(),
});

const dataSchema = z.object({
  leaderboard: z.array(leaderboardItemSchema),
  currentUser: leaderboardItemSchema,
  pagination: paginationSchema,
  context: contextSchema,
});

export const leaderboardResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number(),
  message: z.string(),
  data: dataSchema.optional(),
});

export type LeaderboardResponse = z.infer<typeof leaderboardResponseSchema>;
