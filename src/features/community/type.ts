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

export type CommunityAuthorRole =
    | "STUDENT"
    | "TEACHER"
    | "ADMIN";

export type CommunityPostDetailContent =
    | {
        type: "TEXT";
        content: string;
    }
    | {
        type: "IMAGE";
        imageUrl: string;
    };

export interface CommunityPostDetailData {
    postId: number;
    title: string;
    category: CommunityCategory;
    viewCount: number;
    likeCount: number;
    isLiked: boolean;
    isMine: boolean;
    authorId: number;
    authorName: string;
    authorProfileImageUrl: string;
    authorRole: CommunityAuthorRole;
    contents: CommunityPostDetailContent[];
    createdAt: string;
}

export type GetCommunityPostDetailResponse =
    ApiResponse<CommunityPostDetailData> & {
        statusCode?: number;
        errors?: Record<string, unknown>;
    };

export type CommunityPostLikeResponse =
    ApiResponse<null>;

export interface CommunityPostListItem {
    postId: number;
    title: string;
    category: CommunityCategory;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    thumbnailUrl: string | null;
    authorName: string;
    authorProfileImageUrl: string;
    authorRole: CommunityAuthorRole;
    createdAt: string;
}

export interface CommunityPostListData {
    posts: CommunityPostListItem[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
}

export type GetCommunityPostListResponse =
    ApiResponse<CommunityPostListData> & {
        statusCode?: number;
        errors?: Record<string, unknown>;
    };

export interface CommunityPostSearchData {
    totalCount: number;
    posts: CommunityPostListItem[];
    nextCursor: number | null;
}

export type SearchCommunityPostResponse =
    ApiResponse<CommunityPostSearchData> & {
        statusCode?: number;
        errors?: Record<string, unknown>;
    };
