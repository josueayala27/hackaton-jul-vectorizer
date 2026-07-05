import { z } from "zod";

export const upsertSchema = z.object({
  index: z.string().min(1).default("places"),
  id: z.string().min(1),
  content: z.record(z.string(), z.unknown()),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type UpsertRequest = z.infer<typeof upsertSchema>;

export const querySchema = z.object({
  index: z.string().min(1).default("places"),
  query: z.string().min(1),
  limit: z.number().int().min(1).max(20).optional().default(5),
  filter: z.string().optional(),
  reranking: z.boolean().optional().default(false),
  semanticWeight: z.number().min(0).max(1).optional(),
  boostEngagement: z.boolean().optional().default(true),
});

export type QueryRequest = z.infer<typeof querySchema>;
