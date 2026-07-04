import { Hono } from "hono";
import { vectorizeRequestSchema } from "../schemas/vectorize";
import { embedText } from "../services/embeddings";
import { upsertVector } from "../services/vector-store";

export const vectorizeRoute = new Hono();

vectorizeRoute.post("/vectorize", async (c) => {
  const parsed = vectorizeRequestSchema.safeParse(await c.req.json());

  if (!parsed.success) {
    return c.json({ error: parsed.error.issues[0].message }, 400);
  }

  const { id, text, metadata } = parsed.data;

  let vector: number[];
  try {
    vector = await embedText(text);
  } catch {
    return c.json({ error: "failed to generate embedding" }, 502);
  }

  try {
    await upsertVector(id, vector, { text, ...metadata });
  } catch {
    return c.json({ error: "failed to store vector" }, 502);
  }

  return c.json({ id, success: true });
});
