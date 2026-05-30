// 채팅 관련

/*
 - 채팅방 목록 조회(friend status===friend) -> 방은 있는데, 친구관계가 아니게 된 경우
 - 채팅방 상세 조회 -> 채팅방 진입-> 특정 채팅방 메시지 내역 조회
 - 메시지 전송
 - 메시지 읽음처리
*/

import {
    BaseResponse, SendMessageProps, SendMessageData,
    ReadMessageProps, ReadMessageData, CreateChatRoomProps,
    CreateChatRoomData, ChatRoomListData,
} from "@/features/phone/chatType";

const BASE_SERVER_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


/*
 채팅 친구 목록 불러오기 서비스Promise<BaseResponse<ChatRoomListData[]>>
 */

export interface Roomdata {
    userId: number;
    name?: string;
    nickname?: string;
    lectureTitle?: string;
    role: string;
    status: string;
    roomId: number;
    content?: string;
    createdAt: string;
    unreadCount?: number;
    profileImageUrl?: string;
}

export interface Responsetype {
    timestamp: string;
    status: number;
    code: string;
    message: string;
    data?: Roomdata[];
}

export const getChatRoomsService = async (
    accessToken: string
): Promise<Responsetype> => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/messages/rooms`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    let result: Responsetype | null = null;

    try {
        result = await response.json();
    } catch (e) {
        throw new Error(`응답 파싱 실패 (HTTP ${response.status})`);
    }

    console.log('응답:', result);

    if (response.ok && result?.status === 200) {
        return result;
    }

    throw new Error(
        result?.message ?? `서버 오류 (${response.status})`
    );
};


// 1. 메시지 전송 서비스
export const sendMessageService = async ({ roomId, content, accessToken }: SendMessageProps): Promise<BaseResponse<SendMessageData>> => {
    try {
        const response = await fetch(`${BASE_SERVER_URL}/api/v1/messages/send/${roomId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ content }),
        });

        const result: BaseResponse<SendMessageData> = await response.json();

        if (response.ok && (result.statusCode === 200 || result.statusCode === 201)) {
            return result;
        }

        if (response.status === 401) throw new Error(result.message || '미로그인');
        if (response.status === 403) throw new Error(result.message || '해당 채팅방에 접근할 권한이 없습니다.');
        if (response.status === 404) throw new Error(result.message || '존재하지 않은 사용자에게 메시지를 전송할 수 없습니다.');
        if (response.status === 409) throw new Error(result.message || '메시지를 전송할 수 없는 상태이거나 대화 상대가 존재하지 않습니다.');

        throw new Error(result.message || '시스템 내부 문제');
    } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error('알 수 없는 오류가 발생했습니다.');
    }
};

// 2. 메시지 읽음 처리 서비스
export const readMessageService = async ({ roomId, accessToken }: ReadMessageProps): Promise<BaseResponse<ReadMessageData>> => {
    try {
        const response = await fetch(`${BASE_SERVER_URL}/api/v1/messages/read/${roomId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const result: BaseResponse<ReadMessageData> = await response.json();

        if (response.ok && result.statusCode === 200) {
            return result;
        }

        if (response.status === 401) throw new Error(result.message || '미로그인');
        if (response.status === 403) throw new Error(result.message || '해당 채팅방에 접근할 권한이 없습니다.');
        if (response.status === 404) throw new Error(result.message || '존재하지 않거나 삭제된 채팅방입니다.');

        throw new Error(result.message || '시스템 내부 문제');
    } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error('알 수 없는 오류가 발생했습니다.');
    }
};

// 3. 채팅방 개설 서비스
export const createChatRoomService = async ({ userId, accessToken }: CreateChatRoomProps): Promise<BaseResponse<CreateChatRoomData>> => {
    try {
        const response = await fetch(`${BASE_SERVER_URL}/api/v1/messages/chatrooms/create/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const result: BaseResponse<CreateChatRoomData> = await response.json();

        if (response.ok && (result.statusCode === 200 || result.statusCode === 201)) {
            return result;
        }

        if (response.status === 401) throw new Error('로그인이 되어 있지 않습니다.');
        if (response.status === 404) throw new Error(result.message || '존재하지 않는 사용자와의 대화창을 개설할 수 없습니다.');
        if (response.status === 409) throw new Error(result.message || '대화창을 개설할 수 없거나 자기 자신과는 개설할 수 없습니다.');

        throw new Error('서버 오류가 발생했습니다.');
    } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error('알 수 없는 오류가 발생했습니다.');
    }
};



// 5. 과거 대화 내역 조회 서비스 (20개씩 무한스크롤 가이드 반영)
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
export interface GetChatHistoryProps {

    roomId: number;

    accessToken: string;

    lastMessageId?: number;
}
export interface GetChatHistoryResponse {

    timestamp: string;

    status: number;

    code: string;

    message: string;

    data: ChatMessage[];

    errors?: Record<string, string>;
}
export const getChatHistoryService = async ({
    roomId,
    lastMessageId,
    accessToken,
}: GetChatHistoryProps): Promise<GetChatHistoryResponse> => {

    try {

        const url =
            lastMessageId
                ? `${BASE_SERVER_URL}/api/v1/messages/history/${roomId}?lastMessageId=${lastMessageId}`
                : `${BASE_SERVER_URL}/api/v1/messages/history/${roomId}`;


        const response = await fetch(
            url,
            {
                method: 'GET',

                headers: {
                    Authorization:
                        `Bearer ${accessToken}`,
                },
            }
        );


        const result:
            GetChatHistoryResponse =
            await response.json();


        // 성공
        if (
            response.ok &&
            result.status === 200
        ) {
            console.log(result, "result")
            return result;
        }


        // 인증 실패
        if (response.status === 401) {

            throw new Error(
                result.message ||
                '로그인이 필요합니다.'
            );
        }


        // 권한 없음
        if (response.status === 403) {

            throw new Error(
                result.message ||
                '채팅방 접근 권한이 없습니다.'
            );
        }


        // 채팅방 없음
        if (response.status === 404) {

            throw new Error(
                result.message ||
                '존재하지 않는 채팅방입니다.'
            );
        }


        throw new Error(
            result.message ||
            '채팅 내역 조회에 실패했습니다.'
        );

    } catch (error) {

        if (error instanceof Error) {

            throw error;
        }

        throw new Error(
            '알 수 없는 오류가 발생했습니다.'
        );
    }
};