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
type ChatHistoryResponseData = ChatRoomResponse[];
export type RawChatHistoryData =
    | ChatHistoryResponseData
    | ChatHistoryData
    | {
        roomInfo?: Partial<ChatRoomInfoData> & {
            memberInfo?: ChatMemberResponse[];
            messages?: Message[];
        };
        memberInfo?: ChatMemberResponse[];
        messages?: Message[];
        roomTitle?: string | null;
    };
export type SendMessageData = SendMessageResponse;
type RawChatRoomListData = Partial<ChatRoomListData> & {
    roomInfo?: Partial<ChatRoomListData> & {
        memberInfo?: ChatMemberResponse[];
    };
    memberInfo?: ChatMemberResponse[];
};
export type RawChatRoomListResponseData =
    | RawChatRoomListData[]
    | { data?: RawChatRoomListData[] | null };

export const getChatRoomSubscribeDestination = (
    roomId: number
) => `/user/sub/chat/room/${roomId}`;

export const normalizeChatRoomListData = (
    rooms?: RawChatRoomListResponseData | null
): ChatRoomListData[] => {
    const roomList =
        Array.isArray(rooms)
            ? rooms
            : rooms?.data ?? [];

    return roomList.map<ChatRoomListData>((room) => {
        if ("roomInfo" in room && room.roomInfo) {
            const roomMemberInfo =
                "memberInfo" in room.roomInfo
                    ? room.roomInfo.memberInfo
                    : undefined;

            return {
                roomId: room.roomInfo.roomId ?? 0,
                roomTitle: room.roomInfo.roomTitle ?? null,
                inMemberCount: room.roomInfo.inMemberCount ?? 0,
                content: room.roomInfo.content ?? "",
                createdAt: room.roomInfo.createdAt ?? "",
                unreadCount: room.roomInfo.unreadCount ?? 0,
                memberInfo: room.memberInfo ?? roomMemberInfo ?? [],
            };
        }

        return {
            roomId: room.roomId ?? 0,
            roomTitle: room.roomTitle ?? null,
            inMemberCount: room.inMemberCount ?? 0,
            content: room.content ?? "",
            createdAt: room.createdAt ?? "",
            unreadCount: room.unreadCount ?? 0,
            memberInfo: room.memberInfo ?? [],
        };
    });
};

export const normalizeChatHistoryData = (
    data?:
        | RawChatHistoryData
        | { data?: RawChatHistoryData | null }
        | null
): ChatHistoryData | undefined => {
    if (!data) {
        return undefined;
    }

    if (
        !Array.isArray(data) &&
        "data" in data &&
        data.data !== undefined
    ) {
        return normalizeChatHistoryData(data.data);
    }

    if (Array.isArray(data)) {
        return data[0];
    }

    if ("roomInfo" in data && data.roomInfo) {
        const roomInfo = data.roomInfo;
        const roomMemberInfo =
            "memberInfo" in roomInfo
                ? roomInfo.memberInfo
                : undefined;
        const roomMessages =
            "messages" in roomInfo
                ? roomInfo.messages
                : undefined;
        const memberInfo =
            data.memberInfo ??
            roomMemberInfo ??
            [];
        const messages =
            data.messages ??
            roomMessages ??
            [];

        if (
            roomInfo.roomId === undefined ||
            roomInfo.inMemberCount === undefined
        ) {
            return undefined;
        }

        return {
            roomTitle: data.roomTitle ?? roomInfo.roomTitle ?? null,
            roomInfo: {
                roomId: roomInfo.roomId,
                roomTitle: roomInfo.roomTitle ?? null,
                inMemberCount: roomInfo.inMemberCount,
                content: roomInfo.content,
                createdAt: roomInfo.createdAt,
                unreadCount: roomInfo.unreadCount,
            },
            memberInfo,
            messages,
        };
    }

    return undefined;
};

export const getChatRoomsService = async (
    accessToken: string
): Promise<ApiResponse<ChatRoomListData[]>> => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v2/messages/chatrooms`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
        }
    );

    const result: ApiResponse<RawChatRoomListData[]> =
        await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "채팅방 목록 조회에 실패했습니다."
        );
    }

    return {
        ...result,
        data: normalizeChatRoomListData(result.data),
    };
};

export function getChatHistoryService(
    accessToken: string,
    roomId: number,
    lastMessageId?: number
): Promise<ApiResponse<RawChatHistoryData>>;

export function getChatHistoryService(
    roomId: number,
    accessToken: string,
    lastMessageId?: number
): Promise<ApiResponse<RawChatHistoryData>>;

export async function getChatHistoryService(
    first: string | number,
    second: string | number,
    lastMessageId?: number
): Promise<ApiResponse<RawChatHistoryData>> {
    const accessToken =
        typeof first === "string" ? first : String(second);

    const roomId =
        typeof first === "number" ? first : Number(second);

    const queryString =
        lastMessageId !== undefined
            ? `?lastMessageId=${lastMessageId}`
            : "";

    const response = await fetch(
        `${BASE_SERVER_URL}/api/v2/messages/history/${roomId}${queryString}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
        }
    );

    const result: ApiResponse<RawChatHistoryData> =
        await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "채팅 내역 조회에 실패했습니다."
        );
    }

    return {
        ...result,
        data: result.data ?? [],
    };
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
    roomInfo: {
        roomId: number;
        roomTitle: string | null;
        inMemberCount: number;
    };
    memberInfo: ChatMemberResponse[];
}

export interface CreateChatRoomRequest {
    chatMember: number[];
    roomTitle?: string | null;
}

export const createChatRoomService = async (
    chatRoom: number | CreateChatRoomRequest,
    accessToken: string
): Promise<ApiResponse<CreateChatRoomData>> => {
    const chatMember =
        typeof chatRoom === "number"
            ? [chatRoom]
            : chatRoom.chatMember;

    const roomTitle =
        typeof chatRoom === "number"
            ? null
            : chatRoom.roomTitle ?? null;

    const queryString =
        roomTitle === null
            ? "?roomTitle="
            : `?roomTitle=${encodeURIComponent(roomTitle)}`;

    const response = await fetch(
        `${BASE_SERVER_URL}/api/v2/messages/chatrooms/create${queryString}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                chatMember,
            }),
        }
    );

    const result: ApiResponse<CreateChatRoomData> =
        await response.json();

    if (result.data?.roomInfo?.roomId) {
        result.data.roomId = result.data.roomInfo.roomId;
    }

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
        `${BASE_SERVER_URL}/api/v1/messages/chatRooms/leave/${roomId}`,
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
