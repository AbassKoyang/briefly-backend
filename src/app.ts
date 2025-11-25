import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { BookmarkRoutes } from "./routes/bookmarks.route.js";

export const app = new Elysia()
  .use(cors())
  .use(swagger())
  .use(BookmarkRoutes);
