import { z } from "zod";

const personalBestsSchema = z.object({}).passthrough(); // flexible for now
const byLanguageSchema = z.object({}).passthrough(); // flexible for now

const progressChartItemSchema = z.object({
  date: z.string(), // could be refined with z.string().date() if strict date validation is needed
  averageWpm: z.number(),
  averageAccuracy: z.number(),
  attemptsCount: z.number(),
});

const statsSchema = z.object({
  totalAttempts: z.number(),
  averageWpm: z.number(),
  bestWpm: z.number(),
  averageAccuracy: z.number(),
  bestAccuracy: z.number(),
  totalTimeTyped: z.number(),
  totalWordsTyped: z.number(),
  personalBests: personalBestsSchema,
  byLanguage: byLanguageSchema,
  progressChart: z.array(progressChartItemSchema),
});

export const statisticsResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number(),
  message: z.string(),
  data: z
    .object({
      stats: statsSchema,
    })
    .optional(),
});

export type StatsResponse = z.infer<typeof statisticsResponseSchema>;
