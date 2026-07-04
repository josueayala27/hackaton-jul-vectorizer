import { Hono } from "hono";
import { placeQuerySchema, placeSchema } from "../schemas/places";
import { searchDocuments, upsertDocument } from "../services/search-store";

const PLACES_INDEX = "places";

export const placesRoute = new Hono();

placesRoute.post("/places/upsert", async (c) => {
  const parsed = placeSchema.safeParse(await c.req.json());

  if (!parsed.success) {
    return c.json({ error: parsed.error.issues[0].message }, 400);
  }

  const { id_place, titulo_video, nombre_lugar, ubicacion, trending, sentimiento_comentarios, descripcion_servicios } =
    parsed.data;

  try {
    await upsertDocument(
      PLACES_INDEX,
      id_place,
      { titulo_video, nombre_lugar, ubicacion, descripcion_servicios },
      { trending, sentimiento_comentarios },
    );
  } catch {
    return c.json({ error: "failed to store place" }, 502);
  }

  return c.json({ id: id_place, success: true });
});

placesRoute.post("/places/query", async (c) => {
  const parsed = placeQuerySchema.safeParse(await c.req.json());

  if (!parsed.success) {
    return c.json({ error: parsed.error.issues[0].message }, 400);
  }

  const { query, limit, filter } = parsed.data;

  try {
    const results = await searchDocuments(PLACES_INDEX, query, limit, filter);
    return c.json(results);
  } catch {
    return c.json({ error: "failed to query places" }, 502);
  }
});
