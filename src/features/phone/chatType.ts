// 공통 응답 구조
export interface BaseResponse<T> {
    timestamp: string;
    status: number;
    code: string;
    message: string;
    data?: T;
    errors?: Record<string, any>;
}

// Action 반환 상태 정의
export interface ActionState {
    timestamp: string;
    status: number;
    code: string;
    message: string;
    data?: any;
    errors?: Record<string, any>;
}

// 1. 메시지 전송 타입
export interface SendMessageProps {
    roomId: number;
    content: string;
    accessToken: string;
}

export interface SendMessageData {
    roomId: number;
    userId: number;
    nickname: string;
    role: string;
    status: string;
    content: string;
    createdAt: string;
}

// 2. 메시지 읽음 처리 타입
export interface ReadMessageProps {
    roomId: number;
    accessToken: string;
}

export interface ReadMessageData {
    roomId: number;
    targetUserId?: number;
    targetUseId?: number; // 백엔드 오타 대응
    nickname: string;
    isRead: boolean;
}

// 3. 채팅방 개설 타입
export interface CreateChatRoomProps {
    userId: number;
    accessToken: string;
}

export interface CreateChatRoomData {
    roomId: number;
    userId: number;
    nickname: string;
    role: string;
    status: string;
}

// 4. 채팅방 목록

export interface ChatRoomListData {
    userId: number;
    nickname: string;
    name?: string;
    lectureTitle?: string;
    role: string;
    status: string;
    roomId: number;
    content: string | null;
    createdAt: string;
    unreadCount: number;
    profileImageUrl?: string;
}

// 5. 채팅 내역 조회

export interface GetChatHistoryProps {
    roomId: number;
    lastMessageId?: number | null;
    accessToken: string;
}

export interface ChatMessage {
    messageId: number;
    senderId: number;
    nickname: string;
    lectureTitle: string;
    role: string;
    status: string;
    content: string;
    createdAt: string;
    isRead: boolean;
    isMine: boolean;
    profileImageUrl: string;
}


export interface SearchedUser {
    userId: number;
    name: string;
    status: 'none' | 'SENT' | 'FRIEND' | 'RECEIVED' | 'BLOCK';
    role: 'STUDENT' | 'TEACHER';
    profileImageUrl: string;
    lectureTitle?: string;
}

export interface SearchUserResponse {
    timestamp: string;
    status: number;
    code: string;
    message: string;
    data: SearchedUser[];
    errors: object;
}