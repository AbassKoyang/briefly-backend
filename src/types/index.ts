export type BookmarkType = {
    id?: string;
    url: string;
    title: string;
    subTitle: string;
    tags: string[];
    summary: string;
    userId: string;
    favicon: string;
    createdAt: number;
    pinned: false;
    lastViewed: number;
    views:  number;
    archived: boolean;
};
export type ApiResponse<T> = {
    success: boolean;
    data?: T;
    message?: string;
  }