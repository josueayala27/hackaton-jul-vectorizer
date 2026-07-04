import { z } from "zod";

export const searchDbUpsertSchema = z.object({
  index: z.string().min(1).default("movies"),
  id: z.string().min(1),
  content: z.record(z.string(), z.unknown()),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type SearchDbUpsertRequest = z.infer<typeof searchDbUpsertSchema>;

export const searchDbQuerySchema = z.object({
  index: z.string().min(1).default("movies"),
  query: z.string().min(1),
  limit: z.number().int().min(1).max(20).optional().default(5),
  filter: z.string().optional(),
});

export type SearchDbQueryRequest = z.infer<typeof searchDbQuerySchema>;
