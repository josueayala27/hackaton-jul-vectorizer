import { z } from "zod";

export const placeSchema = z.object({
  id_place: z.string().min(1),
  titulo_video: z.string().min(1),
  nombre_lugar: z.string().min(1),
  ubicacion: z.string().min(1),
  trending: z.object({
    likes: z.number().int().min(0),
    views: z.number().int().min(0),
  }),
  sentimiento_comentarios: z.string().min(1),
  descripcion_servicios: z.string().min(1),
});

export type Place = z.infer<typeof placeSchema>;

export const placeQuerySchema = z.object({
  query: z.string().min(1),
  limit: z.number().int().min(1).max(20).optional().default(5),
  filter: z.string().optional(),
});

export type PlaceQueryRequest = z.infer<typeof placeQuerySchema>;
