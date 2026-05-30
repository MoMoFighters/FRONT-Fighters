'use server'

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { sendMessageService, readMessageService, createChatRoomService } from "@/app/services/phone/chat/service";
import { ActionState } from "./chatType";

/*
    CHAT 전송용
*/
export const sendMessageAction = async (
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        if (!accessToken) {
            return { success: false, message: '로그인이 필요합니다.' };
        }

        const roomId = Number(formData.get('roomId'));
        const content = formData.get('content') as string;

        if (!roomId || !content?.trim()) {
            return { success: false, message: '잘못된 요청 정보입니다.' };
        }

        const result = await sendMessageService({ roomId, content, accessToken });

        // 실시간 방 리스트 정렬 순서 최신화 및 메시지 최신화를 위해 캐시 갱신
        revalidatePath('/teacher/ask');
        revalidatePath('/student/phone/friends');

        return {
            success: true,
            message: result.message,
            data: result.data
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : '메시지 전송에 실패하였습니다.'
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


export const createChatRoomAction = async (
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        if (!accessToken) {
            return { success: false, message: '로그인이 되어 있지 않습니다.' };
        }

        const userId = Number(formData.get('userId')); // 개설할 대화상대의 ID

        if (!userId) {
            return { success: false, message: '상대방 정보가 누락되었습니다.' };
        }

        const result = await createChatRoomService({ userId, accessToken });

        revalidatePath('/teacher/ask');
        revalidatePath('/student/phone/friends');

        return {
            success: true,
            message: result.message,
            data: result.data
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : '서버 오류가 발생했습니다.'
        };
    }
};