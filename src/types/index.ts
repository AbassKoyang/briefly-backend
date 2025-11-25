
export type BookmarkType = {
    url: string;
    title: string;
    subTitle: string;
    tags: string[];
    summary: string;
    userId: string;
    favicon: string;
    createdAt: Date;
 };
 export type ApiResponse<T> = {
    success: boolean;
    data?: T;
    message?: string;
  }