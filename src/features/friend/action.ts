"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import type { ApiResponse } from "@/lib/api";
import {
    searchUserService,
    getFriendsService,
    getBlockedFriendsService,
    sendFriendRequestService,
    cancelFriendRequestService,
    acceptFriendRequestService,
    rejectFriendRequestService,
    blockFriendService,
    unblockFriendService,
    deleteFriendService,
} from "@/app/services/phone/friend/service";

type FriendStatus = "none" | "SENT" | "RECEIVED" | "FRIEND" | "BLOCK";

interface FriendData {
    userId: number;
    name?: string;
    nickname: string;
    role: "STUDENT" | "TEACHER";
    status: FriendStatus;
    profileImageUrl?: string;
    lectureTitle?: string;
}

export type FriendActionType =
    | "SEND"
    | "CANCEL"
    | "ACCEPT"
    | "REJECT"
    | "BLOCK"
    | "UNBLOCK"
    | "DELETE";

const getAccessToken = async () => {
    const cookieStore = await cookies();
    return cookieStore.get("accessToken")?.value;
};

const createErrorResponse = <T>(
    error: unknown,
    message: string
): ApiResponse<T> => ({
    timestamp: new Date().toISOString(),
    status: 500,
    code: "INTERNAL_SERVER_ERROR",
    message: error instanceof Error ? error.message : message,
    data: null,
});

export const searchUserAction = async (
    nickname: string
): Promise<ApiResponse<FriendData[]>> => {
    try {
        const accessToken = await getAccessToken();

        if (!accessToken) {
            return {
                timestamp: new Date().toISOString(),
                status: 401,
                code: "UNAUTHORIZED",
                message: "로그인이 필요합니다.",
                data: null,
            };
        }

        return await searchUserService(
            nickname.trim(),
            accessToken
        );
    } catch (error) {
        return createErrorResponse<FriendData[]>(
            error,
            "사용자 검색에 실패했습니다."
        );
    }
};

export const getFriendListAction = async (
    type: "FRIEND" | "BLOCKED"
): Promise<ApiResponse<FriendData[]>> => {
    try {
        const accessToken = await getAccessToken();

        if (!accessToken) {
            return {
                timestamp: new Date().toISOString(),
                status: 401,
                code: "UNAUTHORIZED",
                message: "로그인이 필요합니다.",
                data: null,
            };
        }

        return type === "BLOCKED"
            ? await getBlockedFriendsService(accessToken)
            : await getFriendsService(accessToken);
    } catch (error) {
        return createErrorResponse<FriendData[]>(
            error,
            "친구 목록 조회에 실패했습니다."
        );
    }
};

export const updateFriendStatus = async (
    actionType: FriendActionType,
    userId: number
): Promise<ApiResponse<unknown>> => {
    try {
        const accessToken = await getAccessToken();

        if (!accessToken) {
            return {
                timestamp: new Date().toISOString(),
                status: 401,
                code: "UNAUTHORIZED",
                message: "로그인이 필요합니다.",
                data: null,
            };
        }

        const actions = {
            SEND: sendFriendRequestService,
            CANCEL: cancelFriendRequestService,
            ACCEPT: acceptFriendRequestService,
            REJECT: rejectFriendRequestService,
            BLOCK: blockFriendService,
            UNBLOCK: unblockFriendService,
            DELETE: deleteFriendService,
        };

        const result = await actions[actionType](
            userId,
            accessToken
        );

        revalidatePath("/student/phone/friends");
        revalidatePath("/teacher/ask");

        return result;
    } catch (error) {
        return createErrorResponse(
            error,
            "친구 상태 변경에 실패했습니다."
        );
    }
};