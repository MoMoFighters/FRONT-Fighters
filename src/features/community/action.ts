'use server'

import {
    createCommunityPostContentsService,
    createCommunityPostService,
    uploadCommunityPostImageService,
} from "@/app/services/community/service";
import {
    CreateCommunityPostContentsRequest,
    CreateCommunityPostRequest,
    CreateCommunityPostResponse,
    CreateCommunityPostContentsResponse,
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
