'use server'

import {
    createCommunityPostContentsService,
    createCommunityPostService,
    getCommunityPostDetailService,
    getCommunityPostListService,
    likeCommunityPostService,
    searchCommunityPostService,
    unlikeCommunityPostService,
    uploadCommunityPostImageService,
} from "@/app/services/community/service";
import {
    CreateCommunityPostContentsRequest,
    CreateCommunityPostRequest,
    CreateCommunityPostResponse,
    CreateCommunityPostContentsResponse,
    CommunityPostLikeResponse,
    CommunityCategory,
    GetCommunityPostDetailResponse,
    GetCommunityPostListResponse,
    SearchCommunityPostResponse,
    UploadCommunityPostImageResponse,
} from "./type";

const createFailureResponse = <T>(
    error: unknown
) => ({
    timestamp: new Date().toISOString(),
    status: 500,
    code: "CLIENT-ACTION-ERROR",
    message:
        error instanceof Error
            ? error.message
            : "요청 처리 중 문제가 발생했습니다.",
    data: undefined as T | undefined,
});

export const createCommunityPostAction = async (
    payload: CreateCommunityPostRequest
): Promise<CreateCommunityPostResponse> => {
    try {
        return await createCommunityPostService(payload);
    } catch (error) {
        return createFailureResponse(error);
    }
};

export const getCommunityPostDetailAction = async (
    postId: number
): Promise<GetCommunityPostDetailResponse> => {
    try {
        return await getCommunityPostDetailService(postId);
    } catch (error) {
        return createFailureResponse(error);
    }
};

export const getCommunityPostListAction = async ({
    category,
    page,
    size,
}: {
    category?: CommunityCategory;
    page: number;
    size: number;
}): Promise<GetCommunityPostListResponse> => {
    try {
        return await getCommunityPostListService({
            category,
            page,
            size,
        });
    } catch (error) {
        return createFailureResponse(error);
    }
};

export const searchCommunityPostAction = async ({
    keyword,
    cursor,
    size,
}: {
    keyword: string;
    cursor?: number | null;
    size: number;
}): Promise<SearchCommunityPostResponse> => {
    try {
        return await searchCommunityPostService({
            keyword,
            cursor,
            size,
        });
    } catch (error) {
        return createFailureResponse(error);
    }
};

export const likeCommunityPostAction = async (
    postId: number
): Promise<CommunityPostLikeResponse> => {
    try {
        return await likeCommunityPostService(postId);
    } catch (error) {
        return createFailureResponse(error);
    }
};

export const unlikeCommunityPostAction = async (
    postId: number
): Promise<CommunityPostLikeResponse> => {
    try {
        return await unlikeCommunityPostService(postId);
    } catch (error) {
        return createFailureResponse(error);
    }
};

export const uploadCommunityPostImageAction = async (
    formData: FormData
): Promise<UploadCommunityPostImageResponse> => {
    try {
        return await uploadCommunityPostImageService(formData);
    } catch (error) {
        return createFailureResponse(error);
    }
};

export const createCommunityPostContentsAction = async (
    postId: number,
    payload: CreateCommunityPostContentsRequest
): Promise<CreateCommunityPostContentsResponse> => {
    try {
        return await createCommunityPostContentsService(
            postId,
            payload
        );
    } catch (error) {
        return createFailureResponse(error);
    }
};
