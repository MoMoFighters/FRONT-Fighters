'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { acceptFriendRequestService, blockFriendService, cancelFriendRequestService, createChatRoomService, deleteFriendService, getBlockedFriendsService, getFriendsService, leaveChatroomService, readMessageService, rejectFriendRequestService, searchUserService, sendFriendRequestService, sendMessageService, unblockFriendService } from '@/app/services/phone/chat/service';

import {
    ActionState,
    BaseResponse,
    SearchedUser,
    SendMessageData,
} from '@/features/phone/chatType';

export interface SendMessageActionRequest {
    roomId: number;
    content: string;
}

export type SendMessageActionResponse =
    BaseResponse<SendMessageData>;

// 메시지 전송 액션
export const sendMessageAction = async ({
    roomId,
    content,
}: SendMessageActionRequest): Promise<SendMessageActionResponse> => {
    try {
        const cookieStore = await cookies();

        const accessToken =
            cookieStore.get('accessToken')?.value;

        if (!accessToken) {
            return {
                timestamp: new Date().toISOString(),
                status: 401,
                code: 'UNAUTHORIZED',
                message: '로그인이 필요합니다.',
                data: undefined as never,
                errors: {},
            };
        }

        if (!roomId) {
            return {
                timestamp: new Date().toISOString(),
                status: 400,
                code: 'INVALID_REQUEST',
                message: '채팅방 정보가 없습니다.',
                data: undefined as never,
                errors: {},
            };
        }

        if (!content.trim()) {
            return {
                timestamp: new Date().toISOString(),
                status: 400,
                code: 'INVALID_REQUEST',
                message: '메시지를 입력해주세요.',
                data: undefined as never,
                errors: {},
            };
        }

        const result =
            await sendMessageService({
                roomId,
                content,
                accessToken,
            });

        revalidatePath('/teacher/ask');
        revalidatePath('/student/phone/friends');

        return result;
    } catch (error) {
        return {
            timestamp: new Date().toISOString(),
            status: 500,
            code: 'INTERNAL_SERVER_ERROR',
            message:
                error instanceof Error
                    ? error.message
                    : '메시지 전송에 실패했습니다.',
            data: undefined as never,
            errors: {},
        };
    }
};

//메시지 읽음 처리 액션 (필요시 방 입장 시점에 래핑 호출 가능)
export const readMessageAction = async (roomId: number): Promise<ActionState> => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        if (!accessToken) return { status: 401, message: '로그인이 필요합니다.', timestamp: '', code: 'FAIL' };

        const result = await readMessageService(roomId, accessToken);

        return result;
    } catch (error) {
        return {
            timestamp: new Date().toISOString(),
            status: 500,
            code: 'FAIL',
            message: error instanceof Error ? error.message : '읽음 처리에 실패했습니다.',
            errors: {},
        };
    }
};


interface SearchUserActionResult {
    success: boolean;
    message: string;
    data?: SearchedUser[];
}

//회원검색 액션ㄴ
export const searchUserAction = async (nickname: string): Promise<SearchUserActionResult> => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        if (!accessToken) {
            return { success: false, message: '로그인이 필요합니다.' };
        }

        if (!nickname?.trim()) {
            return { success: false, message: '닉네임을 입력해주세요.' };
        }

        const result = await searchUserService({ nickname: nickname.trim(), accessToken });

        return {
            success: true,
            message: result.message,
            data: result.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : '사용자 검색에 실패했습니다.',
        };
    }
};

//친추보내기 액션
export const sendFriendRequestAction = async (userId: number) => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        if (!accessToken) {
            return { success: false, message: '로그인이 필요합니다.' };
        }

        if (!userId) {
            return { success: false, message: '대상 사용자 정보가 없습니다.' };
        }

        const result = await sendFriendRequestService(userId, accessToken);

        revalidatePath('/student/phone/friends');
        revalidatePath('/teacher/ask');

        return { success: true, message: result.message, data: result.data };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : '요청에 실패했습니다.',
        };
    }
};

// 친추 취소하기 액션
export const cancelFriendRequestAction = async (userId: number) => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        if (!accessToken) {
            return { success: false, message: '로그인이 필요합니다.' };
        }

        if (!userId) {
            return { success: false, message: '대상 사용자 정보가 없습니다.' };
        }

        const result = await cancelFriendRequestService(userId, accessToken);

        revalidatePath('/student/phone/friends');
        revalidatePath('/teacher/ask');

        return { success: true, message: result.message, data: result.data };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : '요청에 실패했습니다.',
        };
    }
};

// 친구수락 액션
export const acceptFriendRequestAction = async (userId: number) => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        if (!accessToken) {
            return { success: false, message: '로그인이 필요합니다.' };
        }

        if (!userId) {
            return { success: false, message: '대상 사용자 정보가 없습니다.' };
        }

        const result = await acceptFriendRequestService(userId, accessToken);

        revalidatePath('/student/phone/friends');
        revalidatePath('/teacher/ask');

        return { success: true, message: result.message, data: result.data };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : '요청에 실패했습니다.',
        };
    }
};

// 친추 거절 액션
export const rejectFriendRequestAction = async (userId: number) => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        if (!accessToken) {
            return { success: false, message: '로그인이 필요합니다.' };
        }

        if (!userId) {
            return { success: false, message: '대상 사용자 정보가 없습니다.' };
        }

        const result = await rejectFriendRequestService(userId, accessToken);

        revalidatePath('/student/phone/friends');
        revalidatePath('/teacher/ask');

        return { success: true, message: result.message, data: result.data };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : '요청에 실패했습니다.',
        };
    }
};

//친구 차단 액션
export const blockFriendAction = async (userId: number) => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        if (!accessToken) {
            return { success: false, message: '로그인이 필요합니다.' };
        }

        if (!userId) {
            return { success: false, message: '대상 사용자 정보가 없습니다.' };
        }

        const result = await blockFriendService(userId, accessToken);

        revalidatePath('/student/phone/friends');
        revalidatePath('/teacher/ask');

        return { success: true, message: result.message, data: result.data };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : '요청에 실패했습니다.',
        };
    }
};

// 친구 차단 해제 액션
export const unblockFriendAction = async (userId: number) => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        if (!accessToken) {
            return { success: false, message: '로그인이 필요합니다.' };
        }

        if (!userId) {
            return { success: false, message: '대상 사용자 정보가 없습니다.' };
        }

        const result = await unblockFriendService(userId, accessToken);

        revalidatePath('/student/phone/friends');
        revalidatePath('/teacher/ask');

        return { success: true, message: result.message, data: result.data };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : '요청에 실패했습니다.',
        };
    }
};

// 친삭하기 액션
export const deleteFriendAction = async (userId: number) => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        if (!accessToken) {
            return { success: false, message: '로그인이 필요합니다.' };
        }

        if (!userId) {
            return { success: false, message: '대상 사용자 정보가 없습니다.' };
        }

        const result = await deleteFriendService(userId, accessToken);

        revalidatePath('/student/phone/friends');
        revalidatePath('/teacher/ask');

        return { success: true, message: result.message, data: result.data };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : '요청에 실패했습니다.',
        };
    }
};

// 채팅방 나가기 액션
export const leaveChatroomAction = async (roomId: number): Promise<ActionState> => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        if (!accessToken) {
            return {
                timestamp: new Date().toISOString(),
                status: 401,
                code: 'UNAUTHORIZED',
                message: '로그인이 필요합니다.',
                errors: {},
            };
        }

        const result = await leaveChatroomService(roomId, accessToken);

        return result;

    } catch (error) {
        return {
            timestamp: new Date().toISOString(),
            status: 500,
            code: 'FAIL',
            message: error instanceof Error ? error.message : '채팅방 나가기에 실패하였습니다.',
            errors: {},
        };
    }
};

// 친구목록 조회 액션함수
export const getFriendsAction = async () => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        if (!accessToken) {
            return {
                timestamp: new Date().toISOString(),
                status: 401,
                code: 'UNAUTHORIZED',
                message: '로그인이 필요합니다.',
                data: [],
                errors: {},
            };
        }

        const result = await getFriendsService(accessToken);

        return result;
    } catch (error) {
        return {
            timestamp: new Date().toISOString(),
            status: 500,
            code: 'FAIL',
            message:
                error instanceof Error
                    ? error.message
                    : '친구 목록 조회에 실패하였습니다.',
            data: [],
            errors: {},
        };
    }
};


// 채팅 개설 액션 함수
export const createChatRoomAction = async (
    userId: number
) => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        if (!accessToken) {
            return {
                timestamp: new Date().toISOString(),
                status: 401,
                code: 'UNAUTHORIZED',
                message: '로그인이 필요합니다.',
                errors: {},
            };
        }

        if (!userId) {
            return {
                timestamp: new Date().toISOString(),
                status: 400,
                code: 'BAD_REQUEST',
                message: '대상 사용자 정보가 없습니다.',
                errors: {},
            };
        }

        const result = await createChatRoomService(
            userId,
            accessToken
        );

        return result;

    } catch (error) {
        return {
            timestamp: new Date().toISOString(),
            status: 500,
            code: 'FAIL',
            message:
                error instanceof Error
                    ? error.message
                    : '채팅방 개설에 실패하였습니다.',
            errors: {},
        };
    }
};

// 차단친구 목록 불러오기 액션
export const getBlockedFriendsAction = async () => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        if (!accessToken) {
            return {
                timestamp: new Date().toISOString(),
                status: 401,
                code: 'UNAUTHORIZED',
                message: '로그인이 필요합니다.',
                data: [],
                errors: {},
            };
        }

        const result = await getBlockedFriendsService(accessToken);

        return result;

    } catch (error) {
        return {
            timestamp: new Date().toISOString(),
            status: 500,
            code: 'FAIL',
            message:
                error instanceof Error
                    ? error.message
                    : '차단 목록 조회 실패',
            data: [],
            errors: {},
        };
    }
};