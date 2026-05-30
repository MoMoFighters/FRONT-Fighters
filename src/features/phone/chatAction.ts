'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { readMessageService, sendMessageService } from '@/app/services/phone/chat/service';

import {
    BaseResponse,
    SendMessageData,
} from '@/features/phone/chatType';

export interface SendMessageActionRequest {
    roomId: number;
    content: string;
}

export type SendMessageActionResponse =
    BaseResponse<SendMessageData>;

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

// 2. 메시지 읽음 처리 액션 (필요시 방 입장 시점에 래핑 호출 가능)
export const readMessageAction = async (roomId: number): Promise<ActionState> => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        if (!accessToken) return { success: false, message: '로그인이 필요합니다.' };

        const result = await readMessageService({ roomId, accessToken });

        revalidatePath('/teacher/ask');
        revalidatePath('/student/phone/friends');

        return { success: true, message: result.message, data: result.data };
    } catch (error) {
        return { success: false, message: error instanceof Error ? error.message : '읽음 처리에 실패했습니다.' };
    }
};


// export const createChatRoomAction = async (
//     prevState: ActionState,
//     formData: FormData
// ): Promise<ActionState> => {
//     try {
//         const cookieStore = await cookies();
//         const accessToken = cookieStore.get('accessToken')?.value;

//         if (!accessToken) {
//             return { success: false, message: '로그인이 되어 있지 않습니다.' };
//         }

//         const userId = Number(formData.get('userId')); // 개설할 대화상대의 ID

//         if (!userId) {
//             return { success: false, message: '상대방 정보가 누락되었습니다.' };
//         }

//         const result = await createChatRoomService({ userId, accessToken });

//         revalidatePath('/teacher/ask');
//         revalidatePath('/student/phone/friends');

//         return {
//             success: true,
//             message: result.message,
//             data: result.data
//         };
//     } catch (error) {
//         return {
//             success: false,
//             message: error instanceof Error ? error.message : '서버 오류가 발생했습니다.'
//         };
//     }
// };