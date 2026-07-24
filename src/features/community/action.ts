'use server'

import {
    createCommunityPostContentsService,
    createCommunityPostCommentService,
    createCommunityPostReplyService,
    createCommunityPostService,
    deleteCommunityPostCommentService,
    deleteCommunityPostReplyService,
    deleteCommunityPostService,
    editCommunityPostContentService,
    editCommunityPostTitleService,
    getCommunityPostCommentsService,
    getCommunityPostDetailService,
    getCommunityPostLikeListService,
    getCommunityPostListService,
    getMyCommunityDashboardService,
    getMyCommunityPostListService,
    getUserCommunityDashboardService,
    getUserCommunityPostListService,
    getCommunityPostRecommendationsService,
    getCommunityPostRepliesService,
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
    GetCommunityPostRecommendationsResponse,
    GetCommunityPostCommentsResponse,
    GetCommunityPostRepliesResponse,
    GetCommunityPostLikeListResponse,
    GetCommunityPostDashboardResponse,
    UploadCommunityPostImageResponse,
    EditCommunityPostTitleResponse,
    EditCommunityPostContentResponse,
    DeleteCommunityPostResponse,
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

export const getCommunityPostRecommendationsAction = async (
    postId: number
): Promise<GetCommunityPostRecommendationsResponse> => {
    try {
        return await getCommunityPostRecommendationsService(postId);
    } catch (error) {
        return createFailureResponse(error);
    }
};

export const getCommunityPostCommentsAction = async ({
    postId,
    cursor,
    size = 10,
}: {
    postId: number;
    cursor?: number | null;
    size?: number;
}): Promise<GetCommunityPostCommentsResponse> => {
    try {
        return await getCommunityPostCommentsService({
            postId,
            cursor,
            size,
        });
    } catch (error) {
        return createFailureResponse(error);
    }
};

export const getCommunityPostRepliesAction = async ({
    postId,
    commentId,
    cursor,
    size = 5,
}: {
    postId: number;
    commentId: number;
    cursor?: number | null;
    size?: number;
}): Promise<GetCommunityPostRepliesResponse> => {
    try {
        return await getCommunityPostRepliesService({
            postId,
            commentId,
            cursor,
            size,
        });
    } catch (error) {
        return createFailureResponse(error);
    }
};

export const createCommunityPostCommentAction = async ({
    postId,
    content,
}: {
    postId: number;
    content: string;
}) => {
    try {
        return await createCommunityPostCommentService({
            postId,
            content,
        });
    } catch (error) {
        return createFailureResponse<null>(error);
    }
};

export const createCommunityPostReplyAction = async ({
    postId,
    commentId,
    content,
}: {
    postId: number;
    commentId: number;
    content: string;
}) => {
    try {
        return await createCommunityPostReplyService({
            postId,
            commentId,
            content,
        });
    } catch (error) {
        return createFailureResponse<null>(error);
    }
};

export const deleteCommunityPostCommentAction = async ({
    postId,
    commentId,
}: {
    postId: number;
    commentId: number;
}) => {
    try {
        return await deleteCommunityPostCommentService({
            postId,
            commentId,
        });
    } catch (error) {
        return createFailureResponse<null>(error);
    }
};

export const deleteCommunityPostReplyAction = async ({
    postId,
    commentId,
    replyId,
}: {
    postId: number;
    commentId: number;
    replyId: number;
}) => {
    try {
        return await deleteCommunityPostReplyService({
            postId,
            commentId,
            replyId,
        });
    } catch (error) {
        return createFailureResponse<null>(error);
    }
};

export const getCommunityPostListAction = async ({
    category,
    cursor,
    size,
}: {
    category?: CommunityCategory;
    cursor?: number | null;
    size: number;
}): Promise<GetCommunityPostListResponse> => {
    try {
        return await getCommunityPostListService({
            category,
            cursor,
            size,
        });
    } catch (error) {
        return createFailureResponse(error);
    }
};

export const searchCommunityPostAction = async ({
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
    try {
        return await searchCommunityPostService({
            keyword,
            category,
            cursor,
            size,
        });
    } catch (error) {
        return createFailureResponse(error);
    }
};

export const getMyCommunityPostListAction = async ({
    cursor,
    size = 10,
}: {
    cursor?: number | null;
    size?: number;
}): Promise<GetCommunityPostListResponse> => {
    try {
        return await getMyCommunityPostListService({
            cursor,
            size,
        });
    } catch (error) {
        return createFailureResponse(error);
    }
};

export const getUserCommunityPostListAction = async ({
    userId,
    cursor,
    size = 10,
}: {
    userId: number;
    cursor?: number | null;
    size?: number;
}): Promise<GetCommunityPostListResponse> => {
    try {
        return await getUserCommunityPostListService({
            userId,
            cursor,
            size,
        });
    } catch (error) {
        return createFailureResponse(error);
    }
};

export const getMyCommunityDashboardAction =
    async (): Promise<GetCommunityPostDashboardResponse> => {
        try {
            return await getMyCommunityDashboardService();
        } catch (error) {
            return createFailureResponse(error);
        }
    };

export const getUserCommunityDashboardAction = async (
    userId: number
): Promise<GetCommunityPostDashboardResponse> => {
    try {
        return await getUserCommunityDashboardService(userId);
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

export const getCommunityPostLikeListAction = async (
    postId: number
): Promise<GetCommunityPostLikeListResponse> => {
    try {
        return await getCommunityPostLikeListService(postId);
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

export const editCommunityPostTitleAction = async ({
    postId,
    title,
    category,
}: {
    postId: number;
    title: string;
    category: CommunityCategory;
}): Promise<EditCommunityPostTitleResponse> => {
    try {
        return await editCommunityPostTitleService(
            postId,
            title,
            category
        );
    } catch (error) {
        return createFailureResponse(error);
    }
};

export const editCommunityPostContentAction = async (
    postId: number,
    payload: CreateCommunityPostContentsRequest
): Promise<EditCommunityPostContentResponse> => {
    try {
        return await editCommunityPostContentService(
            postId,
            payload
        );
    } catch (error) {
        return createFailureResponse(error);
    }
};

export const deleteCommunityPostAction = async (
    postId: number
): Promise<DeleteCommunityPostResponse> => {
    try {
        return await deleteCommunityPostService(postId);
    } catch (error) {
        return createFailureResponse(error);
    }
};
