export type ChatMemberRole = "STUDENT" | "TEACHER" | "ADMIN"

export type ChatMemberStatus = "FRIEND" | "FREIND" | "SENT" | "BLOCK" | "none" | "me";

export type ChatSystemMessageType = "INVITE" | "LEAVE" | "RENAME" | null;

export interface ChatMemberResponse {
    userId: number;
    name: string | null;
    nickname: string;
    lectureTitle: string | null;
    role: ChatMemberRole;
    status: ChatMemberStatus;
    profileImageUrl: string;
    isLeftRoom: boolean;
}

export interface ChatRoomListResponse {
    roomId: number;
    roomTitle: string | null;
    inMemberCount: number;
    content: string;
    createdAt: string;
    unreadCount: number;
    memberInfo: ChatMemberResponse[];
}

export interface RoomInfo {
    roomId: number;
    roomTitle: string | null;
    inMemberCount: number;
    content?: string;
    createdAt?: string;
    unreadCount?: number;
    memberInfo?: ChatMemberResponse[];
}

export interface ChatRoomResponse {
    roomTitle: string | null;
    roomInfo: RoomInfo;
    memberInfo: ChatMemberResponse[];
    messages: Message[];
}

export interface Message {
    messageId: number;
    content: string;
    createdAt: string;

    senderId: number | null;
    name: string | null;
    nickname: string | null;
    role: ChatMemberRole | null;
    status: ChatMemberStatus | null;
    unreadCount: number | null;
    isMine: boolean | null;
    isLeftRoom: boolean | null;
    profileImageUrl: string | null;
    targetUserId: number | null;
    type: ChatSystemMessageType | null;
}

export interface SendMessageResponse {
    roomId: number;
    userId: number;
    nickname: string;
    role: ChatMemberRole;
    status: ChatMemberStatus;
    content: string;
    createdAt: string;
}

export interface ChatRoomMemberInfo {
    userId: number;
    name: string | null;
    nickname: string;
    role: ChatMemberRole;
    status: ChatMemberStatus;
    profileImageUrl: string;
}

export interface ChatRoomMembersResponse {
    memberInfo: ChatRoomMemberInfo[];
}






// 4. 채팅방 목록


// 5. 채팅 내역 조회












// 4. 채팅방 목록


// 5. 채팅 내역 조회





