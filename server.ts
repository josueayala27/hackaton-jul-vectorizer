import { Hono } from "hono";
import { logger } from "hono/logger";
import { queryRoute } from "./server/routes/query";

const app = new Hono();

app.use(logger());

app.get("/", (c) => {
  return c.text("Hello, Hono with Nitro!");
});

app.route("/", queryRoute);

export default app;
