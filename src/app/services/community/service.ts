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
    GetCommunityPostDashboardResponse,
    UploadCommunityPostImageResponse,
    EditCommunityPostTitleResponse,
    EditCommunityPostContentResponse,
    DeleteCommunityPostResponse,
} from "@/features/community/type";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 토큰을 넘기지 않는 fetch (게시글 목록/상세/검색/추천 조회 전용)
const fetchWithoutAuth = async (
    endpoint: string,
    options: RequestInit = {}
): Promise<Response> => {
    const headers = {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        ...options.headers,
    };

    return fetch(`${BASE_URL}${endpoint}`, {
        headers,
        ...options,
    });
};

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


// 게시글 생성
export const createCommunityPostService = async (
    payload: CreateCommunityPostRequest
): Promise<CreateCommunityPostResponse> => {
    const response = await fetchWithAuth("/api/v2/posts", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    return parseApiResponse(response, "create post");
};

// 게시글 이미지 업로드
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

// 게시글 콘텐츠 업로드
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




// 게시글 상세조회
// isLiked는 요청자가 누구인지에 따라 달라지는 값이라 로그인 사용자는 토큰을 실어 보내야 한다.
// 비로그인(게스트)은 accessToken 쿠키가 없으므로 fetchWithAuth가 자동으로 인증 없는 요청으로 폴백한다.
export const getCommunityPostDetailService = async (
    postId: number
): Promise<GetCommunityPostDetailResponse> => {
    const response = await fetchWithAuth(`/api/v2/posts/${postId}`, {
        method: "GET",
        cache: "no-store",
    });

    return parseApiResponse(response, "get post detail");
};

// 추천 게시글 목록 조회
export const getCommunityPostRecommendationsService = async (
    postId: number
): Promise<GetCommunityPostRecommendationsResponse> => {
    const response = await fetchWithoutAuth(`/api/v2/posts/${postId}/recommendations`, {
        method: "GET",
        cache: "no-store",
    });

    return parseApiResponse(response, "get post recommendations");
};




// 댓글 조회
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
            cache: "no-store",
        }
    );

    return parseApiResponse(response, "get post comments");
};

// 답글 조회
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
            cache: "no-store",
        }
    );

    return parseApiResponse(response, "get post replies");
};

// 댓글 달기
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

// 답글 달기
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

// 댓글 삭제
export const deleteCommunityPostCommentService = async ({
    postId,
    commentId,
}: {
    postId: number;
    commentId: number;
}): Promise<ApiResponse<null>> => {
    const response = await fetchWithAuth(
        `/api/v2/posts/${postId}/comments/${commentId}`,
        {
            method: "DELETE",
            cache: "no-store",
        }
    );

    return parseApiResponse(response, "delete post comment");
};

// 답글 삭제
export const deleteCommunityPostReplyService = async ({
    postId,
    commentId,
    replyId,
}: {
    postId: number;
    commentId: number;
    replyId: number;
}): Promise<ApiResponse<null>> => {
    const response = await fetchWithAuth(
        `/api/v2/posts/${postId}/comments/${commentId}/replies/${replyId}`,
        {
            method: "DELETE",
            cache: "no-store",
        }
    );

    return parseApiResponse(response, "delete post reply");
};





// 게시글 목록조회
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
    const response = await fetchWithoutAuth(
        `/api/v2/posts?${queryString}`,
        {
            method: "GET",
            cache: "no-store",
        }
    );

    return parseApiResponse(response, "get post list");
};

// 게시글 검색
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

    const response = await fetchWithoutAuth(
        `/api/v2/posts/search?${params.toString()}`,
        {
            method: "GET",
            cache: "no-store",
        }
    );

    return parseApiResponse(response, "search post list");
};





// 내 게시글 목록 조회
export const getMyCommunityPostListService = async ({
    cursor,
    size,
}: {
    cursor?: number | null;
    size: number;
}): Promise<GetCommunityPostListResponse> => {
    const params = new URLSearchParams({
        size: String(size),
    });

    if (cursor !== undefined && cursor !== null) {
        params.set("cursor", String(cursor));
    }

    const response = await fetchWithAuth(
        `/api/v2/posts/me?${params.toString()}`,
        {
            method: "GET",
            cache: "no-store",
        }
    );

    return parseApiResponse(response, "get my post list");
};

// 다른 유저 게시글 목록조회
export const getUserCommunityPostListService = async ({
    userId,
    cursor,
    size,
}: {
    userId: number;
    cursor?: number | null;
    size: number;
}): Promise<GetCommunityPostListResponse> => {
    const params = new URLSearchParams({
        size: String(size),
    });

    if (cursor !== undefined && cursor !== null) {
        params.set("cursor", String(cursor));
    }

    const response = await fetchWithAuth(
        `/api/v2/posts/users/${userId}?${params.toString()}`,
        {
            method: "GET",
            cache: "no-store",
        }
    );

    return parseApiResponse(response, "get user post list");
};






// 내 커뮤니티 대시보드 조회
export const getMyCommunityDashboardService =
    async (): Promise<GetCommunityPostDashboardResponse> => {
        const response = await fetchWithAuth("/api/v2/posts/me/dashboard", {
            method: "GET",
            cache: "no-store",
        });

        return parseApiResponse(response, "get my post dashboard");
    };

// 다른 유저 커뮤니티 대시보드 조회
export const getUserCommunityDashboardService = async (
    userId: number
): Promise<GetCommunityPostDashboardResponse> => {
    const response = await fetchWithAuth(
        `/api/v2/posts/users/${userId}/dashboard`,
        {
            method: "GET",
            cache: "no-store",
        }
    );

    return parseApiResponse(response, "get user post dashboard");
};





// 게시글 좋아요
export const likeCommunityPostService = async (
    postId: number
): Promise<CommunityPostLikeResponse> => {
    const response = await fetchWithAuth(`/api/v2/posts/${postId}/likes`, {
        method: "POST",
    });

    return parseApiResponse(response, "like post");
};

// 게시글 좋아요 취소
export const unlikeCommunityPostService = async (
    postId: number
): Promise<CommunityPostLikeResponse> => {
    const response = await fetchWithAuth(`/api/v2/posts/${postId}/likes`, {
        method: "DELETE",
    });

    return parseApiResponse(response, "unlike post");
};

// 게시글 좋아요 누른 사람 목록 조회
export const getCommunityPostLikeListService = async (
    postId: number
): Promise<GetCommunityPostLikeListResponse> => {
    const response = await fetchWithAuth(`/api/v2/posts/${postId}/likes`, {
        method: "GET",
        cache: "no-store",
    });

    return parseApiResponse(response, "get post like list");
};




// 게시글 수정
export const editCommunityPostTitleService = async (
    postId: number,
    title: string,
    category: CommunityCategory
): Promise<EditCommunityPostTitleResponse> => {
    const response = await fetchWithAuth(`/api/v2/posts/${postId}`, {
        method: "PATCH",
        body: JSON.stringify({
            title, category
        })
    });

    return parseApiResponse(response, "edit post title");
};

// 게시글 콘텐츠 수정
export const editCommunityPostContentService = async (
    postId: number,
    payload: CreateCommunityPostContentsRequest
): Promise<EditCommunityPostContentResponse> => {
    const response = await fetchWithAuth(`/api/v2/posts/${postId}/contents`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });

    return parseApiResponse(response, "edit post content");
};

// 게시글 삭제
export const deleteCommunityPostService = async (
    postId: number
): Promise<DeleteCommunityPostResponse> => {
    const response = await fetchWithAuth(`/api/v2/posts/${postId}`, {
        method: "DELETE",
    });

    return parseApiResponse(response, "delete post");
};
