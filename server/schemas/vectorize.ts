import { z } from "zod";

export const vectorizeRequestSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type VectorizeRequest = z.infer<typeof vectorizeRequestSchema>;
