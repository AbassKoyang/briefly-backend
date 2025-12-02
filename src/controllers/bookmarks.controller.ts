import { BookmarkService } from "../services/bookmark.js";
import { ApiResponse, BookmarkType } from "../types/index.js";



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

  list: async ({ params, query }: any): Promise<ApiResponse<{bookmarks: BookmarkType[], lastVisible: number}>> => {
    try {
      const userId = params.userId;
      const pageParam = query.pageParam;
      if (!userId) throw new Error("Missing userId parameter");

      const {bookmarks, lastVisible} = await BookmarkService.getBookmarks(userId, Number(pageParam));
      console.log(lastVisible);
      return {
        success: true,
        data: {
          bookmarks,
          lastVisible
        },
      };
    } catch (error: any) {
      console.error("Error listing bookmarks:", error);

      return {
        success: false,
        message: error.message || "Failed to list bookmarks",
      };
    }
  },
  listArchived: async ({ params, query }: any): Promise<ApiResponse<{bookmarks: BookmarkType[], lastVisible: number}>> => {
    try {
      const userId = params.userId;
      const pageParam = query.pageParam;
      if (!userId) throw new Error("Missing userId parameter");

      const {bookmarks, lastVisible} = await BookmarkService.getArchivedBookmarks(userId, Number(pageParam));
      console.log(lastVisible);
      console.log('Archives:', bookmarks);
      return {
        success: true,
        data: {
          bookmarks,
          lastVisible
        },
      };
    } catch (error: any) {
      console.error("Error listing archived bookmarks:", error);

      return {
        success: false,
        message: error.message || "Failed to list bookmarks",
      };
    }
  },

  listPinned: async ({ params, query }: any): Promise<ApiResponse<any>> => {
    try {
      const userId = params.userId;
      if (!userId) throw new Error("Missing userId parameter");

      const bookmarks = await BookmarkService.getPinnedBookmarks(userId);
      console.log(bookmarks);
      return {
        success: true,
        data: bookmarks
      };
    } catch (error: any) {
      console.error("Error listing pinned bookmarks:", error);

      return {
        success: false,
        message: error.message || "Failed to list pinned bookmarks",
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
  incrementViews: async ({params}: any) : Promise<ApiResponse<null>> => {
    try {
      const id = params.id;
      if (!id) throw new Error("Missing bookmark id");

      await BookmarkService.incrementViews(id);
      console.log("Views incremented successfully")
      return {
        success: true,
        message: "Bookmark views incremented successfully",
      };
    } catch (error: any) {
      console.error("Error incrementing bookmark views:", error);

      return {
        success: false,
        message: error.message || "Failed to increment views",
      };
    }
  },
  pinToTop: async ({params}: any) : Promise<ApiResponse<null>> => {
    try {
      const id = params.id;
      if (!id) throw new Error("Missing bookmark id");

      await BookmarkService.pinToTop(id);
      console.log("Bookmark pinned successfully")
      return {
        success: true,
        message: "Bookmark pinned successfully",
      };
    } catch (error: any) {
      console.error("Error pinning bookmark to top:", error);

      return {
        success: false,
        message: error.message || "Failed to pin bookmark to top",
      };
    }
  },
  unPin: async ({params}: any) : Promise<ApiResponse<null>> => {
    try {
      const id = params.id;
      if (!id) throw new Error("Missing bookmark id");

      await BookmarkService.unPin(id);
      console.log("Bookmark unpinned successfully")
      return {
        success: true,
        message: "Bookmark unpinned successfully",
      };
    } catch (error: any) {
      console.error("Error unpinning bookmark from top:", error);

      return {
        success: false,
        message: error.message || "Failed to unpin bookmark from top",
      };
    }
  },
  archiveBookmark: async ({params}: any) : Promise<ApiResponse<null>> => {
    try {
      const id = params.id;
      if (!id) throw new Error("Missing bookmark id");

      await BookmarkService.archiveBookmark(id);
      console.log("Bookmark archived successfully")
      return {
        success: true,
        message: "Bookmark archived successfully",
      };
    } catch (error: any) {
      console.error("Error unarchiving bookmark:", error);

      return {
        success: false,
        message: error.message || "Failed to archive bookmark",
      };
    }
  },
  unarchiveBookmark: async ({params}: any) : Promise<ApiResponse<null>> => {
    try {
      const id = params.id;
      if (!id) throw new Error("Missing bookmark id");

      await BookmarkService.unarchiveBookmark(id);
      console.log("Bookmark unarchived successfully")
      return {
        success: true,
        message: "Bookmark unarchived successfully",
      };
    } catch (error: any) {
      console.error("Error unarchiving bookmark from top:", error);

      return {
        success: false,
        message: error.message || "Failed to unarchive bookmark",
      };
    }
  }
};
 