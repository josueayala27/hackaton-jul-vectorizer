import { Hono } from "hono";
import { searchRequestSchema } from "../schemas/search";
import { embedText } from "../services/embeddings";
import { queryVector } from "../services/vector-store";

export const searchRoute = new Hono();

searchRoute.post("/search", async (c) => {
  const parsed = searchRequestSchema.safeParse(await c.req.json());

  if (!parsed.success) {
    return c.json({ error: parsed.error.issues[0].message }, 400);
  }

  const { query, topK } = parsed.data;

  let vector: number[];
  try {
    vector = await embedText(query);
  } catch {
    return c.json({ error: "failed to generate embedding" }, 502);
  }

  let matches: Awaited<ReturnType<typeof queryVector>>;
  try {
    matches = await queryVector(vector, topK);
  } catch {
    return c.json({ error: "failed to query vector store" }, 502);
  }

  return c.json(matches)

  // return c.json({
  //   query,
  //   results: matches.map(({ id, score, metadata }) => {
  //     const { text, ...rest } = metadata ?? {};
  //     return { id, score, text, metadata: rest };
  //   }),
  // });
});
