import type { ApiResponse } from "@/lib/api";

const BASE_SERVER_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL;


// ==========================================
// 1. 채팅방 목록 조회
// GET /api/v1/messages/rooms
// ==========================================

export interface ChatRoomMemberData {
    userId: number;
    name: string | null;
    nickname: string;
    role: "STUDENT" | "TEACHER";
    profileImageUrl: string | null;
    lectureTitle?: string | null;
    status: "FRIEND" | "BLOCK" | null;
}

export interface ChatRoomInfoData {
    roomId: number;
    roomTitle: string | null;
    memberInfo: ChatRoomMemberData[];
    inMemberCount: number;
}

export interface ChatRoomListData {
    roomInfo: ChatRoomInfoData;
    content: string | null;
    createdAt: string | null;
    unreadCount: number;
}

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


// ==========================================
// 2. 채팅 내역 조회
// GET /api/v1/messages/history/{roomId}
// ==========================================

export interface ChatMessageData {
    messageId: number;
    content: string;
    name: string | null;
    nickname?: string | null;
    profileImageUrl: string | null;
    createdAt: string;
    role: "STUDENT" | "TEACHER" | null;
    status: "FRIEND" | "BLOCK" | null;
    isMine: boolean;
    isRead?: boolean;
    type: "INVITE" | "LEAVE" | "RENAME" | null;
}

export interface ChatHistoryData {
    roomInfo: ChatRoomInfoData;
    messages: ChatMessageData[];
}

export const getChatHistoryService = async (
    roomId: number,
    accessToken: string,
    lastMessageId?: number
): Promise<ApiResponse<ChatHistoryData>> => {
    const queryString = lastMessageId
        ? `?lastMessageId=${lastMessageId}`
        : "";

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
};


// ==========================================
// 3. 메시지 전송
// POST /api/v1/messages/send/{roomId}
// ==========================================

export interface SendMessageData {
    messageId: number;
    roomId: number;
    userId: number;
    nickname: string;
    role: "STUDENT" | "TEACHER";
    status: "FRIEND" | "BLOCK" | null;
    content: string;
    createdAt: string;
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


// ==========================================
// 4. 메시지 읽음 처리
// PATCH /api/v1/messages/read/{roomId}
// ==========================================

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


// ==========================================
// 5. 채팅방 생성 또는 기존 채팅방 조회
// POST /api/v1/messages/chatrooms/create/{userId}
// ==========================================

export interface CreateChatRoomData {
    roomId: number;
    userId: number;
    nickname: string;
    role: "STUDENT" | "TEACHER";
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


// ==========================================
// 6. 채팅방 나가기
// DELETE /api/v1/messages/leave/{roomId}
// ==========================================

export interface LeaveChatRoomMemberData {
    userId: number;
    name: string | null;
    nickname: string;
    role: "STUDENT" | "TEACHER";
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