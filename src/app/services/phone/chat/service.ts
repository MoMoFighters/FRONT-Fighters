// 채팅 관련

/*
 - 채팅방 목록 조회(friend status===friend) -> 방은 있는데, 친구관계가 아니게 된 경우
 - 채팅방 상세 조회 -> 채팅방 진입-> 특정 채팅방 메시지 내역 조회
 - 메시지 전송
 - 메시지 읽음처리CreateChatRoomData,
*/

import {
    BaseResponse, SendMessageProps, SendMessageData,
    ReadMessageProps, ReadMessageData, CreateChatRoomProps,
    ChatRoomListData,
    SearchUserResponse,
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
        throw new Error(`에러: ${response.status}`);
    }

    console.log('응답:', result);

    if (response.ok && result?.status === 200) {
        return result;
    }

    throw new Error(
        result?.message ?? `서버 오류: (${response.status})`
    );
};


// 메시지 전송 서비스
export const sendMessageService = async ({
    roomId,
    content,
    accessToken,
}: SendMessageProps): Promise<BaseResponse<SendMessageData>> => {
    try {
        const response = await fetch(
            `${BASE_SERVER_URL}/api/v1/messages/send/${roomId}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    content,
                }),
            }
        );

        const result: BaseResponse<SendMessageData> =
            await response.json();

        if (
            response.ok &&
            (result.status === 200 ||
                result.status === 201)
        ) {
            return result;
        }

        if (response.status === 401)
            throw new Error(
                result.message || '로그인이 필요합니다.'
            );

        if (response.status === 403)
            throw new Error(
                result.message ||
                '해당 채팅방에 접근할 권한이 없습니다.'
            );

        if (response.status === 404)
            throw new Error(
                result.message ||
                '존재하지 않는 사용자입니다.'
            );

        if (response.status === 409)
            throw new Error(
                result.message ||
                '메시지를 전송할 수 없는 사용자입니다.'
            );

        throw new Error(
            result.message ||
            '메시지 전송에 실패했습니다.'
        );
    } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error(
            '알 수 없는 오류가 발생했습니다.'
        );
    }
};

// 메시지 읽음 처리 서비스
export interface ReadMessageResponse {
    timestamp: string;
    status: number;
    code: string;
    message: string;
    data: {
        roomId: number;
        targetUserId: number;
        nickname: string;
        isRead: boolean;
    };
    errors: Record<string, unknown>;
}

export interface ReadMessageResponse {
    timestamp: string;
    status: number;
    code: string;
    message: string;
    data: {
        roomId: number;
        targetUserId: number;
        nickname: string;
        isRead: boolean;
    };
    errors: Record<string, unknown>;
}



//메시지 읽음처리 서비스
export const readMessageService = async (
    roomId: number,
    accessToken: string
): Promise<ReadMessageResponse> => {

    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/messages/read/${roomId}`,
        {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    const result: ReadMessageResponse = await response.json();

    if (response.status === 403) {
        throw new Error(result.message || '해당 채팅방에 접근할 권한이 없습니다.');
    }

    if (response.status === 404) {
        throw new Error(result.message || '존재하지 않거나 삭제된 채팅방입니다.');
    }

    if (!response.ok) {
        throw new Error(result.message || '읽음 처리에 실패하였습니다.');
    }

    return result;
};

// 유저 검색 서비스
export const searchUserService = async ({
    nickname,
    accessToken,
}: {
    nickname: string;
    accessToken: string;
}): Promise<SearchUserResponse> => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/friends/find?nickname=${encodeURIComponent(nickname)}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    const result: SearchUserResponse = await response.json();

    if (!response.ok) {
        throw new Error(result.message || '사용자 검색에 실패했습니다.');
    }

    return result;
};



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

// 과거 대화 내역 조회 서비스 (20개씩 무한스크롤 가이드 반영)
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


// 친추 보내기 서비스
export const sendFriendRequestService = async (
    userId: number,
    accessToken: string
) => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/friends/request/${userId}`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || '요청에 실패했습니다.');
    }

    return result;
};


// 친추 취소하기 서비스
export const cancelFriendRequestService = async (
    userId: number,
    accessToken: string
) => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/friends/request/${userId}`,
        {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || '요청에 실패했습니다.');
    }

    return result;
};


// 친추 수락 서비스
export const acceptFriendRequestService = async (
    userId: number,
    accessToken: string
) => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/friends/received/${userId}/accept`,
        {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || '요청에 실패했습니다.');
    }

    return result;
};


// 친추 거절 서비스
export const rejectFriendRequestService = async (
    userId: number,
    accessToken: string
) => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/friends/received/${userId}/reject`,
        {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || '요청에 실패했습니다.');
    }

    return result;
};


// 친구 차단 서비스
export const blockFriendService = async (
    userId: number,
    accessToken: string
) => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/friends/block/${userId}`,
        {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || '요청에 실패했습니다.');
    }

    return result;
};


// 친구 차단 취소 서비스
export const unblockFriendService = async (
    userId: number,
    accessToken: string
) => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/friends/unblock/${userId}`,
        {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || '요청에 실패했습니다.');
    }

    return result;
};


// 친구삭제 서비스
export const deleteFriendService = async (
    userId: number,
    accessToken: string
) => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/friends/delete/${userId}`,
        {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || '요청에 실패했습니다.');
    }

    return result;
};



// 친추 받은 목록 불러오기 서비스
export const getReceivedFriendRequestsService = async (
    accessToken: string
) => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/friends/received`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || '요청에 실패했습니다.');
    }

    return result;
};


// 친추 보낸 목록 불러오기 서비스
export const getSentFriendRequestsService = async (
    accessToken: string
) => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/friends/sent`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || '요청에 실패했습니다.');
    }

    return result;
};






export interface LeaveChatroomMember {
    roomId: number;
    userId: number;
    nickname: string;
    role: string;
    status: string;
}

export interface LeaveChatroomResponse {
    timestamp: string;
    status: number;
    code: string;
    message: string;
    data: LeaveChatroomMember[] | Record<string, never>;
    errors: Record<string, unknown>;
}

// 채팅방 나가기 서비스
export const leaveChatroomService = async (
    roomId: number,
    accessToken: string
): Promise<LeaveChatroomResponse> => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/messages/chatRooms/leave/${roomId}`,
        {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );
    console.log('s1')
    const result: LeaveChatroomResponse = await response.json();
    console.log("s2", result)
    if (response.status === 404) {
        console.log('s3')
        throw new Error(result.message || '존재하지 않거나 이미 나간 채팅방입니다.');
    }

    if (response.status === 403) {
        console.log('s4')
        throw new Error(result.message || '해당 채팅방을 나갈 권한이 없습니다.');
    }

    if (!response.ok) {
        console.log('s5')
        throw new Error(result.message || '채팅방 나가기에 실패하였습니다.');
    }

    console.log('s6')
    return result;
};


// 친구 목록 조회하기 서비스
export interface FriendData {
    userId: number;
    name?: string;
    nickname: string;
    lectureTitle?: string;
    role: 'STUDENT' | 'TEACHER';
    status: 'none' | 'SENT' | 'FRIEND' | 'RECEIVED' | 'BLOCK';
    profileImageUrl?: string;
}

export interface GetFriendsResponse {
    timestamp: string;
    status: number;
    code: string;
    message: string;
    data: FriendData[];
    errors?: Record<string, string>;
}

export const getFriendsService = async (
    accessToken: string
): Promise<GetFriendsResponse> => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/friends`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    const result: GetFriendsResponse = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || '친구 목록을 불러오지 못했습니다.'
        );
    }

    return result;
};

// 채팅시작하기
export interface CreateChatRoomData {
    roomId: number;
    userId: number;
    nickname: string;
    role: string;
    status: string;
}

export interface CreateChatRoomResponse {
    timestamp: string;
    status: number;
    code: string;
    message: string;
    data?: CreateChatRoomData;
    errors?: Record<string, string>;
}

export const createChatRoomService = async (
    userId: number,
    accessToken: string
): Promise<CreateChatRoomResponse> => {
    try {
        const response = await fetch(
            `${BASE_SERVER_URL}/api/v1/messages/chatrooms/create/${userId}`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        const result: CreateChatRoomResponse =
            await response.json();

        if (
            response.ok &&
            (result.status === 200 ||
                result.status === 201)
        ) {
            return result;
        }

        if (response.status === 401) {
            throw new Error(
                result.message ||
                '로그인이 필요합니다.'
            );
        }

        if (response.status === 404) {
            throw new Error(
                result.message ||
                '존재하지 않는 사용자와의 대화창을 개설할 수 없습니다.'
            );
        }

        if (response.status === 409) {
            throw new Error(
                result.message ||
                '대화창을 개설할 수 없는 사용자입니다.'
            );
        }

        throw new Error(
            result.message ||
            '채팅방 개설에 실패하였습니다.'
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


// 차단친구 목록 불러오기 서비스
export interface BlockedFriendData {
    userId: number;
    nickname: string;
    role: 'STUDENT' | 'TEACHER';
    status: 'BLOCK';
    profileImageUrl?: string;
}

export interface BlockedFriendResponse {
    timestamp: string;
    status: number;
    code: string;
    message: string;
    data: BlockedFriendData[];
    errors?: Record<string, string>;
}

export const getBlockedFriendsService = async (
    accessToken: string
): Promise<BlockedFriendResponse> => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v1/friends/blocked`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    const result: BlockedFriendResponse = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || '차단 목록 조회 실패'
        );
    }

    return result;
};