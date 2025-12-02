import { Elysia } from "elysia";
import { BookmarksController } from "../controllers/bookmarks.controller.js";

export const BookmarkRoutes = new Elysia()
  .post("/api/bookmarks", BookmarksController.create)
  .get("/api/bookmarks/:userId", BookmarksController.list)
  .get("/api/bookmarks/:userId/archived", BookmarksController.listArchived)
  .get("/api/bookmarks/:userId/pinned", BookmarksController.listPinned)
  .delete("/api/bookmarks/:id", BookmarksController.delete)
  .patch("/api/bookmarks/:id/views", BookmarksController.incrementViews)
  .patch("/api/bookmarks/:id/pin", BookmarksController.pinToTop)
  .patch("/api/bookmarks/:id/unpin", BookmarksController.unPin)
  .patch("/api/bookmarks/:id/archive", BookmarksController.archiveBookmark)
  .patch("/api/bookmarks/:id/unarchive", BookmarksController.unarchiveBookmark);