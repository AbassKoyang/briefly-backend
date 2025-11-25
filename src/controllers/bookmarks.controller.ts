import { BookmarkService } from "../services/bookmark.js";
import { ApiResponse } from "../types/index.js";



export const BookmarksController = {
  create: async ({ body }: any): Promise<ApiResponse<any>> => {
    try {
      const bookmark = await BookmarkService.createBookmark(body);

      return {
        success: true,
        data: bookmark,
      };
    } catch (error: any) {
      console.error("Error creating bookmark:", error);

      return {
        success: false,
        message: error.message || "Failed to create bookmark",
      };
    }
  },

  list: async ({ params }: any): Promise<ApiResponse<any[]>> => {
    try {
      const userId = params.userId;
      if (!userId) throw new Error("Missing userId parameter");

      const bookmarks = await BookmarkService.getBookmarks(userId);
      return {
        success: true,
        data: bookmarks,
      };
    } catch (error: any) {
      console.error("Error listing bookmarks:", error);

      return {
        success: false,
        message: error.message || "Failed to list bookmarks",
      };
    }
  },

  delete: async ({ params }: any): Promise<ApiResponse<null>> => {
    try {
      const id = params.id;
      if (!id) throw new Error("Missing bookmark id");

      await BookmarkService.deleteBookmark(id);
      return {
        success: true,
        message: "Bookmark deleted successfully",
      };
    } catch (error: any) {
      console.error("Error deleting bookmark:", error);

      return {
        success: false,
        message: error.message || "Failed to delete bookmark",
      };
    }
  },
};
