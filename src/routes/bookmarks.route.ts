import { Elysia } from "elysia";
import { BookmarksController } from "../controllers/bookmarks.controller.js";

export const BookmarkRoutes = new Elysia()
  .post("/api/bookmarks", BookmarksController.create)
  .get("/api/bookmarks/:userId", BookmarksController.list)
  .delete("/api/bookmarks/:id", BookmarksController.delete);
