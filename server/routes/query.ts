import { Hono } from "hono";
import { querySchema, upsertSchema } from "../schemas/query";
import { searchDocuments, upsertDocument } from "../services/search-store";

export const queryRoute = new Hono();

queryRoute.post("/upsert", async (c) => {
  const parsed = upsertSchema.safeParse(await c.req.json());

  if (!parsed.success) {
    return c.json({ error: parsed.error.issues[0].message }, 400);
  }

  const { index, id, content, metadata } = parsed.data;

  try {
    await upsertDocument(index, id, content, metadata);
  } catch {
    return c.json({ error: "failed to store document" }, 502);
  }

  return c.json({ id, success: true });
});

queryRoute.post("/query", async (c) => {
  const parsed = querySchema.safeParse(await c.req.json());

  if (!parsed.success) {
    return c.json({ error: parsed.error.issues[0].message }, 400);
  }

  const { index, query, limit, filter } = parsed.data;

  let results: Awaited<ReturnType<typeof searchDocuments>>;
  try {
    results = await searchDocuments(index, query, limit, filter);
  } catch {
    return c.json({ error: "failed to query search database" }, 502);
  }

  return c.json(results);
});
