import { ApiResponse, fetchWithAuth } from "@/lib/api";
import { cookies } from "next/headers";
import {
    CreateCommunityPostContentsRequest,
    CreateCommunityPostContentsResponse,
    CreateCommunityPostRequest,
    CreateCommunityPostResponse,
    CommunityPostLikeResponse,
    CommunityCategory,
    GetCommunityPostDetailResponse,
    GetCommunityPostListResponse,
    SearchCommunityPostResponse,
    GetCommunityPostRecommendationsResponse,
    GetCommunityPostCommentsResponse,
    GetCommunityPostRepliesResponse,
    GetCommunityPostLikeListResponse,
    UploadCommunityPostImageResponse,
} from "@/features/community/type";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const parseApiResponse = async <T>(
    response: Response,
    context: string
): Promise<ApiResponse<T>> => {
    const result =
        await response.json().catch(() => null);

    if (result) {
        if (typeof result.status !== "number" && typeof result.statusCode === "number") {
            result.status = result.statusCode;
        }

        if (typeof result.status !== "number") {
            result.status = response.status;
        }

        if (!result.timestamp) {
            result.timestamp = new Date().toISOString();
        }

        if (!result.code) {
            result.code = response.ok ? "COMMON-SUCCESS" : "COMMON-FAILED";
        }

        if (!result.message) {
            result.message = response.ok
                ? "요청에 성공했습니다."
                : `${context} 요청에 실패했습니다.`;
        }

        return result;
    }

    return {
        timestamp: new Date().toISOString(),
        status: response.status,
        code: "COMMON-UNKNOWN",
        message: "알 수 없는 문제가 발생했습니다.",
    };
};

export const createCommunityPostService = async (
    payload: CreateCommunityPostRequest
): Promise<CreateCommunityPostResponse> => {
    const response = await fetchWithAuth("/api/v2/posts", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    return parseApiResponse(response, "create post");
};

export const getCommunityPostDetailService = async (
    postId: number
): Promise<GetCommunityPostDetailResponse> => {
    const response = await fetchWithAuth(`/api/v2/posts/${postId}`, {
        method: "GET",
    });

    return parseApiResponse(response, "get post detail");
};

export const getCommunityPostRecommendationsService = async (
    postId: number
): Promise<GetCommunityPostRecommendationsResponse> => {
    const response = await fetchWithAuth(`/api/v2/posts/${postId}/recommendations`, {
        method: "GET",
    });

    return parseApiResponse(response, "get post recommendations");
};

export const getCommunityPostCommentsService = async ({
    postId,
    cursor,
    size,
}: {
    postId: number;
    cursor?: number | null;
    size: number;
}): Promise<GetCommunityPostCommentsResponse> => {
    const params = new URLSearchParams({
        size: String(size),
    });

    if (cursor !== undefined && cursor !== null) {
        params.set("cursor", String(cursor));
    }

    const response = await fetchWithAuth(
        `/api/v2/posts/${postId}/comments?${params.toString()}`,
        {
            method: "GET",
        }
    );

    return parseApiResponse(response, "get post comments");
};

export const getCommunityPostRepliesService = async ({
    postId,
    commentId,
    cursor,
    size,
}: {
    postId: number;
    commentId: number;
    cursor?: number | null;
    size: number;
}): Promise<GetCommunityPostRepliesResponse> => {
    const params = new URLSearchParams({
        size: String(size),
    });

    if (cursor !== undefined && cursor !== null) {
        params.set("cursor", String(cursor));
    }

    const response = await fetchWithAuth(
        `/api/v2/posts/${postId}/comments/${commentId}/replies?${params.toString()}`,
        {
            method: "GET",
        }
    );

    return parseApiResponse(response, "get post replies");
};

export const createCommunityPostCommentService = async ({
    postId,
    content,
}: {
    postId: number;
    content: string;
}): Promise<ApiResponse<null>> => {
    const response = await fetchWithAuth(`/api/v2/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({
            content,
        }),
    });

    return parseApiResponse(response, "create post comment");
};

export const createCommunityPostReplyService = async ({
    postId,
    commentId,
    content,
}: {
    postId: number;
    commentId: number;
    content: string;
}): Promise<ApiResponse<null>> => {
    const response = await fetchWithAuth(
        `/api/v2/posts/${postId}/comments/${commentId}/replies`,
        {
            method: "POST",
            body: JSON.stringify({
                content,
            }),
        }
    );

    return parseApiResponse(response, "create post reply");
};

export const getCommunityPostListService = async ({
    category,
    cursor,
    size,
}: {
    category?: CommunityCategory;
    cursor?: number | null;
    size: number;
}): Promise<GetCommunityPostListResponse> => {
    const params = new URLSearchParams();

    if (category) {
        params.set("category", category);
    }

    if (cursor !== undefined && cursor !== null) {
        params.set("cursor", String(cursor));
    }

    params.set("size", String(size));

    const queryString = params.toString();
    const response = await fetchWithAuth(
        `/api/v2/posts?${queryString}`,
        {
            method: "GET",
            cache: "no-store",
        }
    );

    return parseApiResponse(response, "get post list");
};

export const searchCommunityPostService = async ({
    keyword,
    category,
    cursor,
    size,
}: {
    keyword: string;
    category?: CommunityCategory;
    cursor?: number | null;
    size: number;
}): Promise<SearchCommunityPostResponse> => {
    const params = new URLSearchParams({
        keyword,
        size: String(size),
    });

    if (category) {
        params.set("category", category);
    }

    if (cursor !== undefined && cursor !== null) {
        params.set("cursor", String(cursor));
    }

    const response = await fetchWithAuth(
        `/api/v2/posts/search?${params.toString()}`,
        {
            method: "GET",
            cache: "no-store",
        }
    );

    return parseApiResponse(response, "search post list");
};

export const likeCommunityPostService = async (
    postId: number
): Promise<CommunityPostLikeResponse> => {
    const response = await fetchWithAuth(`/api/v2/posts/${postId}/likes`, {
        method: "POST",
    });

    return parseApiResponse(response, "like post");
};

export const unlikeCommunityPostService = async (
    postId: number
): Promise<CommunityPostLikeResponse> => {
    const response = await fetchWithAuth(`/api/v2/posts/${postId}/likes`, {
        method: "DELETE",
    });

    return parseApiResponse(response, "unlike post");
};

export const getCommunityPostLikeListService = async (
    postId: number
): Promise<GetCommunityPostLikeListResponse> => {
    const response = await fetchWithAuth(`/api/v2/posts/${postId}/likes`, {
        method: "GET",
        cache: "no-store",
    });

    return parseApiResponse(response, "get post like list");
};

export const uploadCommunityPostImageService = async (
    formData: FormData
): Promise<UploadCommunityPostImageResponse> => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const response = await fetch(`${BASE_URL}/api/v2/posts/images`, {
        method: "POST",
        headers: {
            ...(accessToken && {
                Authorization: `Bearer ${accessToken}`,
            }),
        },
        body: formData,
    });

    return parseApiResponse(response, "upload post image");
};

export const createCommunityPostContentsService = async (
    postId: number,
    payload: CreateCommunityPostContentsRequest
): Promise<CreateCommunityPostContentsResponse> => {
    const response = await fetchWithAuth(`/api/v2/posts/${postId}/contents`, {
        method: "POST",
        body: JSON.stringify(payload),
    });

    return parseApiResponse(response, "create post contents");
};
