'use server'

import {
    createCommunityPostContentsService,
    createCommunityPostService,
    getCommunityPostDetailService,
    likeCommunityPostService,
    unlikeCommunityPostService,
    uploadCommunityPostImageService,
} from "@/app/services/community/service";
import {
    CreateCommunityPostContentsRequest,
    CreateCommunityPostRequest,
    CreateCommunityPostResponse,
    CreateCommunityPostContentsResponse,
    CommunityPostLikeResponse,
    GetCommunityPostDetailResponse,
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
        const a = await getCommunityPostDetailService(postId);
        console.log(a);
        return a
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
