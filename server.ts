import { Hono } from "hono";
import { logger } from 'hono/logger';
import { vectorizeRoute } from "./server/routes/vectorize";

const app = new Hono();

app.use(logger())

app.get("/", (c) => {
  return c.text("Hello, Hono with Nitro!");
});

app.route("/", vectorizeRoute);

export default app;
