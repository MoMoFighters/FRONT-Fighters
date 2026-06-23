import type { ApiResponse } from "@/lib/api";
import type {
    ChatMemberResponse,
    ChatRoomListResponse,
    ChatRoomResponse,
    Message,
    SendMessageResponse,
} from "@/features/chat/type";

const BASE_SERVER_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL;

export type ChatRoomMemberData = ChatMemberResponse;
export type ChatRoomInfoData = ChatRoomResponse["roomInfo"];
export type ChatRoomListData = ChatRoomListResponse;
export type ChatMessageData = Message;
export type ChatHistoryData = ChatRoomResponse;
export type SendMessageData = SendMessageResponse;

export const getChatRoomSubscribeDestination = (
    roomId: number
) => `/user/sub/chat/room/${roomId}`;

export const getChatRoomsService = async (
    accessToken: string
): Promise<ApiResponse<ChatRoomListData[]>> => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/messages/rooms`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
        }
    );

    const result: ApiResponse<ChatRoomListData[]> =
        await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "채팅방 목록 조회에 실패했습니다."
        );
    }

    return result;
};

export function getChatHistoryService(
    accessToken: string,
    roomId: number,
    lastMessageId?: number
): Promise<ApiResponse<ChatHistoryData>>;

export function getChatHistoryService(
    roomId: number,
    accessToken: string,
    lastMessageId?: number
): Promise<ApiResponse<ChatHistoryData>>;

export async function getChatHistoryService(
    first: string | number,
    second: string | number,
    lastMessageId?: number
): Promise<ApiResponse<ChatHistoryData>> {
    const accessToken =
        typeof first === "string" ? first : String(second);

    const roomId =
        typeof first === "number" ? first : Number(second);

    const queryString =
        lastMessageId ? `?lastMessageId=${lastMessageId}` : "";

    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/messages/history/${roomId}${queryString}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
        }
    );

    const result: ApiResponse<ChatHistoryData> =
        await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "채팅 내역 조회에 실패했습니다."
        );
    }

    return result;
}

export const sendMessageService = async (
    roomId: number,
    content: string,
    accessToken: string
): Promise<ApiResponse<SendMessageData>> => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/messages/send/${roomId}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                content,
            }),
        }
    );

    const result: ApiResponse<SendMessageData> =
        await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "메시지 전송에 실패했습니다."
        );
    }

    return result;
};

export interface ReadMessageData {
    roomId: number;
    targetUserId: number;
    nickname: string;
    isRead: boolean;
}

export const readMessageService = async (
    roomId: number,
    accessToken: string
): Promise<ApiResponse<ReadMessageData>> => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/messages/read/${roomId}`,
        {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    const result: ApiResponse<ReadMessageData> =
        await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "메시지 읽음 처리에 실패했습니다."
        );
    }

    return result;
};

export interface CreateChatRoomData {
    roomId: number;
    userId: number;
    nickname: string;
    role: string;
    status: string;
}

export const createChatRoomService = async (
    userId: number,
    accessToken: string
): Promise<ApiResponse<CreateChatRoomData>> => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/messages/chatrooms/create/${userId}`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    const result: ApiResponse<CreateChatRoomData> =
        await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "채팅방 조회에 실패했습니다."
        );
    }

    return result;
};

export interface LeaveChatRoomMemberData {
    userId: number;
    name: string | null;
    nickname: string;
    role: string;
    status: string;
    profileImageUrl?: string | null;
}

export interface LeaveChatRoomData {
    roomId: number;
    currentMemberCount: number;
    isLocked: boolean;
    members: LeaveChatRoomMemberData[];
}

export const leaveChatroomService = async (
    roomId: number,
    accessToken: string
): Promise<ApiResponse<LeaveChatRoomData>> => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/messages/leave/${roomId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    const result: ApiResponse<LeaveChatRoomData> =
        await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "채팅방 나가기에 실패했습니다."
        );
    }

    return result;
};
