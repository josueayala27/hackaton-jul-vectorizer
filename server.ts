import { Hono } from "hono";
import { logger } from "hono/logger";
import { vectorizeRoute } from "./server/routes/vectorize";
import { searchRoute } from "./server/routes/search";
import { searchDbRoute } from "./server/routes/search-db";
import { placesRoute } from "./server/routes/places";

const app = new Hono();

app.use(logger());

app.get("/", (c) => {
  return c.text("Hello, Hono with Nitro!");
});

app.route("/", vectorizeRoute);
app.route("/", searchRoute);
app.route("/", searchDbRoute);
app.route("/", placesRoute);

export default app;
