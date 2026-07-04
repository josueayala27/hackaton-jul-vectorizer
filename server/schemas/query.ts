import { z } from "zod";

export const upsertSchema = z.object({
  index: z.string().min(1).default("movies"),
  id: z.string().min(1),
  content: z.record(z.string(), z.unknown()),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type UpsertRequest = z.infer<typeof upsertSchema>;

export const querySchema = z.object({
  index: z.string().min(1).default("movies"),
  query: z.string().min(1),
  limit: z.number().int().min(1).max(20).optional().default(5),
  filter: z.string().optional(),
});

export type QueryRequest = z.infer<typeof querySchema>;
