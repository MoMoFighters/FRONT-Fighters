"use server";

import { cookies } from "next/headers";
import type { ApiResponse } from "@/lib/api";
import {
    sendMessageService,
    createChatRoomService,
    readMessageService,
    leaveChatroomService,
} from "@/app/services/phone/chat/service";

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

interface SendMessageData {
    roomId: number;
    userId: number;
    nickname: string;
    content: string;
    createdAt: string;
}

export const sendMessageAction = async (
    roomId: number,
    content: string
): Promise<ApiResponse<SendMessageData>> => {
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

        return await sendMessageService(
            roomId,
            content.trim(),
            accessToken
        );
    } catch (error) {
        return createErrorResponse<SendMessageData>(
            error,
            "메시지 전송에 실패했습니다."
        );
    }
};

interface ChatRoomData {
    roomId: number;
    userId: number;
    nickname: string;
    role: string;
    status: string;
}

export const createChatRoomAction = async (
    userId: number
): Promise<ApiResponse<ChatRoomData>> => {
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

        return await createChatRoomService(
            userId,
            accessToken
        );
    } catch (error) {
        return createErrorResponse<ChatRoomData>(
            error,
            "채팅방 조회에 실패했습니다."
        );
    }
};

export const readMessageAction = async (
    roomId: number
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

        return await readMessageService(
            roomId,
            accessToken
        );
    } catch (error) {
        return createErrorResponse(
            error,
            "읽음 처리에 실패했습니다."
        );
    }
};

export const leaveChatroomAction = async (
    roomId: number
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

        return await leaveChatroomService(
            roomId,
            accessToken
        );
    } catch (error) {
        return createErrorResponse(
            error,
            "채팅방 나가기에 실패했습니다."
        );
    }
};