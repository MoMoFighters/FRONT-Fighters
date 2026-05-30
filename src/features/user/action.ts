'use server'

import {
    getMyInfoService,
    editMyInfoService,
    nicknameCheckService,
    EditMyInfoResponse,
    NicknameCheckResponse
} from "@/app/services/user/service";
import { cookies } from "next/headers";

// 내 정보 불러오기 인터페이스 규격
export interface MomoUserInfoResponse {
    success: boolean;
    message: string;
    data?: MomoUserInfo;
}

export interface MomoUserInfo {
    profileImageUrl: string;
    email: string | null;
    name: string;
    nickname: string | null;
    isTempPwd: boolean;
    createdAt?: string;
    points?: number;
    isPaid?: boolean;
}

// 1. 내 정보 불러오기 액션
export const getMyInfo = async (): Promise<MomoUserInfoResponse> => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        if (!accessToken) {
            return {
                success: false,
                message: '다시 로그인 해주세요',
            };
        }

        const result = await getMyInfoService(accessToken);

        return {
            success: true,
            message: '성공',
            data: {
                profileImageUrl: result.data?.profileImageUrl,
                email: result.data?.email || null,
                name: result.data.name,
                nickname: result.data?.nickname || null,
                isTempPwd: result.data.isTempPwd
            }
        };
    } catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : '내 정보를 불러오는 중 오류가 발생했습니다.';

        return {
            success: false,
            message: errorMessage,
        };
    }
};

export interface EditMyInfoInput {
    nickname?: string;
    currentPassword?: string;
    password?: string;
}

// 2. 내 정보 수정하기 액션 (비어있던 부분 완성)
export const editMyInfo = async (
    { nickname, currentPassword, password }: EditMyInfoInput
): Promise<EditMyInfoResponse> => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        if (!accessToken) {
            return {
                success: false,
                message: '로그인 세션이 만료되었습니다.',
            };
        }

        // 서비스 영역 함수 호출
        const result = await editMyInfoService({
            accessToken,
            nickname,
            currentPassword,
            password
        });

        return result;
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : '정보 수정 중 알 수 없는 오류가 발생했습니다.'
        };
    }
};

// 3. 닉네임 중복확인 및 검증 액션 (새로 추가)
export const checkAndRegisterNickname = async (
    nickname: string
) => {

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
        return {
            success: false,
            message: '로그인 세션이 만료되었습니다.',
        };
    }

    const result =
        await nicknameCheckService(
            accessToken,
            nickname
        );

    console.log(result, '???');

    return result;

};