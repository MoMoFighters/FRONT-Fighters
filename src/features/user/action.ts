'use server'

import {
    getMyInfoService,
    editMyInfoService,
    nicknameCheckService,
    NicknameCheckResponse,
    approvePendingTeacher,
    rejectPendingTeacher,
    plusReportCount,
    minusReportCount,
} from "@/app/services/user/service";
import { cookies } from "next/headers";
import { ApiResponse } from "@/lib/api";
import { Category } from "../lecture/type";
import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

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
    doNotDisturb: boolean;
    membership: 'BASIC' | 'PLUS' | 'PRO';
    membershipStart: string | null;
    membershipUntil: string | null;
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

        const result = await unstable_cache(
            () => getMyInfoService(accessToken),
            ["my-info", accessToken],
            { revalidate: 30, tags: ["my-info"] }
        )();
        const userDetail = result.data.userDetail;
        const buildings = result.data.buildings ?? [];
        const points = userDetail.point ?? userDetail.points ?? result.data.point ?? result.data.points ?? 0;
        const membership: MomoUserInfo['membership'] =
            userDetail.membership === "PLUS" || userDetail.membership === "PRO"
                ? userDetail.membership
                : "BASIC";

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
                doNotDisturb: userDetail.doNotDisturb ?? false,
                membership,
                membershipStart: userDetail.membershipStart ?? null,
                membershipUntil: userDetail.membershipUntil ?? null,
                isPaid: membership !== "BASIC",
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
    itemName?: string | null;
    nickname?: string | null;
    currentPassword?: string | null;
    password?: string | null;
}

// 2. 내 정보 수정하기 액션 (비어있던 부분 완성)
export const editMyInfo = async (
    { itemName, nickname, currentPassword, password }: EditMyInfoInput
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

        const payload: EditMyInfoInput & { accessToken: string } = {
            accessToken,
        };

        if (typeof itemName === "string" && itemName.trim()) {
            payload.itemName = itemName.trim();
        }

        if (typeof nickname === "string" && nickname.trim()) {
            payload.nickname = nickname.trim();
        }

        if (
            typeof currentPassword === "string" &&
            currentPassword.trim()
        ) {
            payload.currentPassword = currentPassword.trim();
        }

        if (typeof password === "string" && password.trim()) {
            payload.password = password.trim();
        }

        const result = await editMyInfoService(payload);

        revalidateTag("my-info", { expire: 0 });
        revalidatePath("/student/mypage");

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


// ==========================================
// 관리자 회원 관리
// ==========================================

export type AdminUserActionResult = {
    success: boolean;
    message?: string;
};

const getAdminActionErrorMessage = (error: unknown) => {
    if (error instanceof Error) {
        const [status, message] = error.message.split("|");

        if (/^\d+$/.test(status) && message) {
            return message;
        }

        return error.message;
    }

    return "요청 처리 중 오류가 발생했습니다.";
};

export const approvePendingTeacherAction = async (
    ids: string[],
): Promise<AdminUserActionResult> => {
    try {
        if (ids.length === 0) {
            return {
                success: false,
                message: "승인할 강사를 선택해주세요.",
            };
        }

        await approvePendingTeacher(ids);
        revalidatePath("/admin/users");

        ids.forEach((id) => {
            revalidatePath(`/admin/users/${id}`);
        });

        return {
            success: true,
            message: ids.length === 1
                ? "강사를 승인했습니다."
                : `${ids.length}명의 강사를 승인했습니다.`,
        };
    } catch (error) {
        return {
            success: false,
            message: getAdminActionErrorMessage(error),
        };
    }
};

export const rejectPendingTeacherAction = async (
    id: string,
    reason: string,
): Promise<AdminUserActionResult> => {
    try {
        const trimmedReason = reason.trim();

        if (!trimmedReason) {
            return {
                success: false,
                message: "거절 사유를 입력해주세요.",
            };
        }

        await rejectPendingTeacher(id, { reason: trimmedReason });
        revalidatePath("/admin/users");
        revalidatePath(`/admin/users/${id}`);

        return {
            success: true,
            message: "강사 승인을 거절했습니다.",
        };
    } catch (error) {
        return {
            success: false,
            message: getAdminActionErrorMessage(error),
        };
    }
};

export const increaseReportCountAction = async (
    id: string,
): Promise<AdminUserActionResult> => {
    try {
        await plusReportCount(id);
        revalidatePath("/admin/users");
        revalidatePath(`/admin/users/${id}`);

        return {
            success: true,
            message: "제재 누적 횟수를 올렸습니다.",
        };
    } catch (error) {
        return {
            success: false,
            message: getAdminActionErrorMessage(error),
        };
    }
};

export const decreaseReportCountAction = async (
    id: string,
): Promise<AdminUserActionResult> => {
    try {
        await minusReportCount(id);
        revalidatePath("/admin/users");
        revalidatePath(`/admin/users/${id}`);

        return {
            success: true,
            message: "제재 누적 횟수를 내렸습니다.",
        };
    } catch (error) {
        return {
            success: false,
            message: getAdminActionErrorMessage(error),
        };
    }
};

export const updateTeacherStatusAction = async (
    id: string,
    action: string,
    reason?: string,
) => {
    if (action === "APPROVE") {
        const result = await approvePendingTeacherAction([id]);

        if (!result.success) {
            throw new Error(result.message ?? "강사 승인에 실패했습니다.");
        }

        return {
            userId: Number(id),
            status: "ACTIVE",
            reason: null,
            processedAt: new Date().toISOString(),
        };
    }

    if (action === "REJECT") {
        const result = await rejectPendingTeacherAction(id, reason ?? "");

        if (!result.success) {
            throw new Error(result.message ?? "강사 승인 거절에 실패했습니다.");
        }

        return {
            userId: Number(id),
            status: "REJECTED",
            reason: reason ?? null,
            processedAt: new Date().toISOString(),
        };
    }

    throw new Error("지원하지 않는 처리 방식입니다.");
};
