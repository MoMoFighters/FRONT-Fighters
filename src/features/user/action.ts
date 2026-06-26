'use server'

import {
    getMyInfoService,
    editMyInfoService,
    nicknameCheckService,
    NicknameCheckResponse,
    updateTeacherStatus
} from "@/app/services/user/service";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { UpdateTeacherStatusResponse } from "./type";
import { ApiResponse } from "@/lib/api";
import { Category } from "../lecture/type";
import { redirect } from "next/navigation";

/* 401 에러 페이지 및 회원탈퇴에서 사용할
   토큰 죽이고, 로그인페이지로 리다이렉트 시키는 함수 */
export const killTokenAction = async () => {
    const cookieStore = await cookies();
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    redirect('/auth/login');
}

// 내 정보 불러오기 인터페이스 규격

export interface MomoUserInfo {
    profileImageUrl: string;
    email: string | null;
    name: string;
    nickname: string | null;
    isTempPwd: boolean;
    createdAt: string;
    points: number;
    buildings: number;
    buildingInfos: BuildingInfo[];
    isPaid: boolean;
}

export interface BuildingInfo {
    category: Category;
    position: number;
    level: number;
}


export type MomoUserInfoResponse = ApiResponse<MomoUserInfo>
export type EditMyInfoActionResponse = ApiResponse<{
    isPwdChanged: boolean;
}>

// 1. 내 정보 불러오기 액션
export const getMyInfo = async (): Promise<MomoUserInfoResponse> => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        if (!accessToken) {
            redirect('/auth/login')
        }

        const result = await getMyInfoService(accessToken);
        const userDetail = result.data.userDetail;
        const buildings = result.data.buildings ?? [];
        const points = result.data.points ?? result.data.point ?? userDetail.points ?? userDetail.point ?? 0;

        return {
            timestamp: result.timestamp,
            status: result.status,
            code: result.code,
            message: result.message,
            data: {
                profileImageUrl: userDetail.profileImageUrl,
                email: userDetail.email,
                name: userDetail.name,
                nickname: userDetail.nickname,
                isTempPwd: userDetail.isTempPwd,
                createdAt: userDetail.createdAt,
                points,
                buildings: buildings.length,
                buildingInfos: buildings,
                isPaid: false,
            },
        };
    } catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : '내 정보를 불러오는 중 오류가 발생했습니다.';

        return {
            timestamp: new Date().toISOString(),
            status: 500,
            code: "USER-MY-INFO-FAILED",
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
): Promise<EditMyInfoActionResponse> => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        if (!accessToken) {
            return {
                timestamp: new Date().toISOString(),
                status: 401,
                code: "COMMON-UNAUTHORIZED",
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
            timestamp: new Date().toISOString(),
            status: 500,
            code: "USER-MY-INFO-UPDATE-FAILED",
            message: error instanceof Error ? error.message : '정보 수정 중 알 수 없는 오류가 발생했습니다.'
        };
    }
};

// 3. 닉네임 중복확인 및 검증 액션 (새로 추가)
export const checkAndRegisterNickname = async (
    nickname: string
): Promise<NicknameCheckResponse> => {

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
        return {
            timestamp: new Date().toISOString(),
            status: 401,
            code: "COMMON-UNAUTHORIZED",
            message: '로그인 세션이 만료되었습니다.',
            data: null,
        };
    }

    const result =
        await nicknameCheckService(
            accessToken,
            nickname
        );


    return result;

};

// 강사 승인 액션 함수

export const updateTeacherStatusAction = async (
    id: string,
    status: string,
    reason?: string,
): Promise<UpdateTeacherStatusResponse> => {
    const payload = {
        action: status,
        reason: reason ?? ((status === "APPROVE" || status === "APPROVED")
            ? "증빙서류가 확인되어 강사 승인이 완료되었습니다."
            : "증빙서류 확인 결과 승인이 거절되었습니다. 다시 제출해주세요."),
    }
    const result = await updateTeacherStatus(id, payload);

    revalidatePath('/admin/users');

    return result;
}
