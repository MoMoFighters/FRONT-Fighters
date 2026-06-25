import { ApiResponse, fetchWithAuth } from "@/lib/api";
import { cookies } from "next/headers";
import {
    CreateCommunityPostContentsRequest,
    CreateCommunityPostContentsResponse,
    CreateCommunityPostRequest,
    CreateCommunityPostResponse,
    CommunityPostLikeResponse,
    GetCommunityPostDetailResponse,
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

        if (!response.ok) {
            console.error(`[community] ${context} failed`, result);
        }

        return result;
    }

    if (!response.ok) {
        console.error(`[community] ${context} failed`, {
            status: response.status,
            statusText: response.statusText,
        });
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
