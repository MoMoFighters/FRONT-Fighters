"use server";

import { cookies } from "next/headers";
import type { ApiResponse } from "@/lib/api";
import {
    createChatRoomService,
    getChatHistoryService,
    getChatRoomsService,
    inviteChatRoomMembersService,
    leaveChatroomService,
    modifyChatRoomTitleService,
    readMessageService,
    sendMessageService,
    type ChatRoomListData,
    type CreateChatRoomRequest,
    type CreateChatRoomData,
    type InviteChatRoomMembersData,
    type LeaveChatRoomData,
    type ModifyChatRoomTitleData,
    type RawChatHistoryData,
    type ReadMessageData,
    type SendMessageData,
} from "@/app/services/phone/chat/service";
import { revalidatePath } from "next/cache";

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
});

const createUnauthorizedResponse = <T>(): ApiResponse<T> => ({
    timestamp: new Date().toISOString(),
    status: 401,
    code: "UNAUTHORIZED",
    message: "로그인이 필요합니다.",
});

export const getChatRoomsAction = async (): Promise<ApiResponse<ChatRoomListData[]>> => {
    try {
        const accessToken = await getAccessToken();

        if (!accessToken) {
            return createUnauthorizedResponse<ChatRoomListData[]>();
        }

        return await getChatRoomsService(accessToken);
    } catch (error) {
        return createErrorResponse<ChatRoomListData[]>(
            error,
            "채팅방 목록 조회에 실패했습니다."
        );
    }
};

export const getChatHistoryAction = async (
    roomId: number,
    lastMessageId?: number
): Promise<ApiResponse<RawChatHistoryData>> => {
    try {
        const accessToken = await getAccessToken();

        if (!accessToken) {
            return createUnauthorizedResponse<RawChatHistoryData>();
        }

        return await getChatHistoryService(
            accessToken,
            roomId,
            lastMessageId
        );
    } catch (error) {
        return createErrorResponse<RawChatHistoryData>(
            error,
            "채팅 내역 조회에 실패했습니다."
        );
    }
};

export const sendMessageAction = async (
    roomId: number,
    content: string
): Promise<ApiResponse<SendMessageData>> => {
    try {
        const accessToken = await getAccessToken();

        if (!accessToken) {
            return createUnauthorizedResponse<SendMessageData>();
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

export const createChatRoomAction = async (
    chatRoom: number | CreateChatRoomRequest
): Promise<ApiResponse<CreateChatRoomData>> => {
    try {
        const accessToken = await getAccessToken();

        if (!accessToken) {
            return createUnauthorizedResponse<CreateChatRoomData>();
        }
        revalidatePath("/student/phone/friends?status=chat")
        return await createChatRoomService(
            chatRoom,
            accessToken
        );
    } catch (error) {
        return createErrorResponse<CreateChatRoomData>(
            error,
            "채팅방 조회에 실패했습니다."
        );
    }
};

export const readMessageAction = async (
    roomId: number
): Promise<ApiResponse<ReadMessageData>> => {
    try {
        const accessToken = await getAccessToken();

        if (!accessToken) {
            return createUnauthorizedResponse<ReadMessageData>();
        }

        return await readMessageService(
            roomId,
            accessToken
        );
    } catch (error) {
        return createErrorResponse<ReadMessageData>(
            error,
            "읽음 처리에 실패했습니다."
        );
    }
};

export const leaveChatroomAction = async (
    roomId: number
): Promise<ApiResponse<LeaveChatRoomData>> => {
    try {
        const accessToken = await getAccessToken();

        if (!accessToken) {
            return createUnauthorizedResponse<LeaveChatRoomData>();
        }

        return await leaveChatroomService(
            roomId,
            accessToken
        );
    } catch (error) {
        return createErrorResponse<LeaveChatRoomData>(
            error,
            "채팅방 나가기에 실패했습니다."
        );
    }
};

export const inviteChatRoomMembersAction = async ({
    roomId,
    chatMember,
}: {
    roomId: number;
    chatMember: number[];
}): Promise<ApiResponse<InviteChatRoomMembersData>> => {
    try {
        const accessToken = await getAccessToken();

        if (!accessToken) {
            return createUnauthorizedResponse<InviteChatRoomMembersData>();
        }

        const result = await inviteChatRoomMembersService({
            roomId,
            chatMember,
            accessToken,
        });

        revalidatePath("/student/phone/friends");
        revalidatePath("/teacher/ask");

        return result;
    } catch (error) {
        return createErrorResponse<InviteChatRoomMembersData>(
            error,
            "채팅방 멤버 초대에 실패했습니다."
        );
    }
};

export const modifyChatRoomTitleAction = async ({
    roomId,
    roomTitle,
}: {
    roomId: number;
    roomTitle: string;
}): Promise<ApiResponse<ModifyChatRoomTitleData>> => {
    try {
        const accessToken = await getAccessToken();

        if (!accessToken) {
            return createUnauthorizedResponse<ModifyChatRoomTitleData>();
        }

        const result = await modifyChatRoomTitleService({
            roomId,
            roomTitle,
            accessToken,
        });

        revalidatePath("/student/phone/friends");
        revalidatePath("/teacher/ask");

        return result;
    } catch (error) {
        return createErrorResponse<ModifyChatRoomTitleData>(
            error,
            "채팅방 이름 변경에 실패했습니다."
        );
    }
};
