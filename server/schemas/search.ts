import { z } from "zod";

export const searchRequestSchema = z.object({
  query: z.string().min(1),
  topK: z.number().int().min(1).max(20).optional().default(5),
});

export type SearchRequest = z.infer<typeof searchRequestSchema>;
