import type { ApiResponse } from "@/lib/api";

export type CommunityCategory =
    | "STUDY"
    | "ART"
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
    thumbnailUrl: string | null;
    contents: CreateCommunityPostContentItem[];
}

export type CreateCommunityPostContentsResponse =
    ApiResponse<null>;

export type EditCommunityPostTitleResponse =
    ApiResponse<null>;

export type EditCommunityPostContentResponse =
    ApiResponse<null>;

export type DeleteCommunityPostResponse =
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
    commentCount?: number;
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

export interface CommunityPostLikedUser {
    userId: number;
    userName: string;
    profileImageUrl: string | null;
    role: CommunityAuthorRole;
}

export interface CommunityPostLikeListData {
    totalCount: number;
    users: CommunityPostLikedUser[];
}

export type GetCommunityPostLikeListResponse =
    ApiResponse<CommunityPostLikeListData> & {
        statusCode?: number;
        errors?: Record<string, unknown>;
    };

export interface CommunityPostListItem {
    postId: number;
    title: string;
    category: CommunityCategory;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    thumbnailUrl: string | null;
    authorId: number;
    authorName: string;
    authorProfileImageUrl: string | null;
    authorRole: CommunityAuthorRole;
    createdAt: string;
}

export interface CommunityPostListData {
    posts: CommunityPostListItem[];
    totalCount: number;
    nextCursor: number | null;
    totalElements?: number;
    totalPages?: number;
    currentPage?: number;
}

export type GetCommunityPostListResponse =
    ApiResponse<CommunityPostListData> & {
        statusCode?: number;
        errors?: Record<string, unknown>;
    };

export type SearchCommunityPostResponse =
    ApiResponse<CommunityPostListData> & {
        statusCode?: number;
        errors?: Record<string, unknown>;
    };

export interface CommunityPostDashboardData {
    totalPostCount: number;
    totalViewCount: number;
    totalLikeCount: number;
    totalCommentCount: number;
}

export type GetCommunityPostDashboardResponse =
    ApiResponse<CommunityPostDashboardData> & {
        statusCode?: number;
        errors?: Record<string, unknown>;
    };

export interface CommunityRecommendedPostItem {
    postId: number;
    title: string;
    category: CommunityCategory;
    viewCount: number;
    likeCount: number;
    commentCount?: number;
    thumbnailUrl: string | null;
    authorId: number;
    authorName: string;
    createdAt: string;
}

export interface CommunityPostRecommendationsData {
    topPosts: CommunityRecommendedPostItem[];
    authorPosts: CommunityRecommendedPostItem[];
}

export type GetCommunityPostRecommendationsResponse =
    ApiResponse<CommunityPostRecommendationsData> & {
        statusCode?: number;
        errors?: Record<string, unknown>;
    };

export interface CommunityPostCommentItem {
    commentId: number;
    authorId: number;
    content: string;
    authorName: string;
    authorProfileImageUrl: string;
    authorRole: CommunityAuthorRole;
    isMine: boolean;
    isPostWriter: boolean;
    createdAt: string;
    replies?: CommunityPostReplyItem[];
    hasMoreReplies?: boolean;
    nextReplyCursor?: number | null;
}

export interface CommunityPostReplyItem {
    commentId: number;
    authorId: number;
    content: string;
    authorName: string;
    authorProfileImageUrl: string;
    authorRole: CommunityAuthorRole;
    isMine: boolean;
    isPostWriter: boolean;
    createdAt: string;
}

export interface CommunityPostCommentsData {
    totalCount: number;
    comments: CommunityPostCommentItem[];
    nextCursor: number | null;
}

export interface CommunityPostRepliesData {
    totalCount: number;
    replies: CommunityPostReplyItem[];
    nextCursor: number | null;
}

export type GetCommunityPostCommentsResponse =
    ApiResponse<CommunityPostCommentsData> & {
        statusCode?: number;
        errors?: Record<string, unknown>;
    };

export type GetCommunityPostRepliesResponse =
    ApiResponse<CommunityPostRepliesData> & {
        statusCode?: number;
        errors?: Record<string, unknown>;
    };
