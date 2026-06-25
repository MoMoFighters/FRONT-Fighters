import type { ApiResponse } from "@/lib/api";

export type CommunityCategory =
    | "STUDY"
    | "FASHION"
    | "BEAUTY"
    | "FITNESS"
    | "COOK"
    | "FREE";

export interface CreateCommunityPostRequest {
    title: string;
    category: CommunityCategory;
}

export interface CreateCommunityPostData {
    postId: number;
}

export type CreateCommunityPostResponse =
    ApiResponse<CreateCommunityPostData>;

export type UploadCommunityPostImageResponse =
    ApiResponse<string>;

export type CommunityPostContentType = "TEXT" | "IMAGE";

export interface CreateCommunityPostContentItem {
    type: CommunityPostContentType;
    content: string | null;
    imageUrl: string | null;
}

export interface CreateCommunityPostContentsRequest {
    thumbnailImageUrl: string | null;
    contents: CreateCommunityPostContentItem[];
}

export type CreateCommunityPostContentsResponse =
    ApiResponse<null>;
