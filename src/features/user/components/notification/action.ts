"use server";

import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import {
    deleteNoticeService,
    getNoticeAppCountsService,
    getNoticeNotificationListService,
    getNoticeTotalCountsServiceByToken,
    readNoticeService,
    toggleNotification,
    type NoticeMutationResponse,
} from "@/app/services/notification/service";
import {
    NoticeAppCountsResponse,
    NoticeNotificationListResponse,
    NoticeTotalCountsResponse,
    ToggleNotificationApiResponse,
} from "./type";

interface AccessTokenPayload {
    sub?: string;
}

// accessToken은 로그인/재발급마다 값이 바뀌므로, 유저당 캐시 엔트리가 하나로 고정되도록
// 토큰 안의 안 바뀌는 유저 식별자(sub)를 캐시 키로 쓴다. 디코드 실패 시에만 토큰 원문으로 폴백.
const getStableUserKey = (accessToken: string): string => {
    try {
        return jwtDecode<AccessTokenPayload>(accessToken).sub ?? accessToken;
    } catch {
        return accessToken;
    }
};

export const getNoticeTotalCountsAction =
    async (): Promise<NoticeTotalCountsResponse> => {
        try {
            const cookieStore = await cookies();
            const accessToken = cookieStore.get("accessToken")?.value;

            if (!accessToken) {
                throw new Error("로그인 세션이 만료되었습니다.");
            }

            // 헤더의 알림 배지는 네비게이션마다 새로 안 쳐도 되는 값이라
            // getMyInfo와 동일하게 짧은 TTL의 unstable_cache로 백엔드 호출을 줄인다.
            return await unstable_cache(
                () => getNoticeTotalCountsServiceByToken(accessToken),
                ["notice-total-counts", getStableUserKey(accessToken)],
                { revalidate: 15, tags: ["notice-total-counts"] }
            )();
        } catch (error) {
            return {
                timestamp: new Date().toISOString(),
                status: 500,
                code: "NOTICE-TOTAL-COUNTS-FAILED",
                message:
                    error instanceof Error
                        ? error.message
                        : "알림 개수를 불러오지 못했습니다.",
            };
        }
    };

export const getNoticeNotificationListAction =
    async (): Promise<NoticeNotificationListResponse> => {
        try {
            const result = await getNoticeNotificationListService();
            return result
        } catch (error) {
            return {
                timestamp: new Date().toISOString(),
                status: 500,
                code: "NOTICE-LIST-FAILED",
                message:
                    error instanceof Error
                        ? error.message
                        : "알림 목록을 불러오지 못했습니다.",
            };
        }
    };

export const getNoticeAppCountsAction =
    async (): Promise<NoticeAppCountsResponse> => {
        try {
            return await getNoticeAppCountsService();
        } catch (error) {
            return {
                timestamp: new Date().toISOString(),
                status: 500,
                statusCode: 500,
                code: "NOTICE-APP-COUNTS-FAILED",
                message:
                    error instanceof Error
                        ? error.message
                        : "앱별 알림 개수를 불러오지 못했습니다.",
                data: null,
            };
        }
    };

const createNoticeMutationErrorResponse = (
    error: unknown,
    message: string
): NoticeMutationResponse => ({
    timestamp: new Date().toISOString(),
    status: 500,
    code: "NOTICE-MUTATION-FAILED",
    message: error instanceof Error ? error.message : message,
    data: [],
});

export const readNoticeAction =
    async (targetId: number[]): Promise<NoticeMutationResponse> => {
        try {
            const result = await readNoticeService(targetId);
            revalidateTag("notice-total-counts", { expire: 0 });
            revalidatePath("/student");
            revalidatePath("/teacher");
            return result;
        } catch (error) {
            return createNoticeMutationErrorResponse(
                error,
                "알림 읽음 처리에 실패했습니다."
            );
        }
    };

export const deleteNoticeAction =
    async (targetId: number[]): Promise<NoticeMutationResponse> => {
        try {
            const result = await deleteNoticeService(targetId);
            revalidateTag("notice-total-counts", { expire: 0 });
            revalidatePath("/student");
            revalidatePath("/teacher");
            return result;
        } catch (error) {
            return createNoticeMutationErrorResponse(
                error,
                "알림 삭제에 실패했습니다."
            );
        }
    };

const createToggleNotificationErrorResponse = (
    error: unknown,
    message: string
): ToggleNotificationApiResponse => ({
    timestamp: new Date().toISOString(),
    status: 500,
    code: "NOTICE-TOGGLE-FAILED",
    message: error instanceof Error ? error.message : message,
    data: null,
});

export const toggleNotificationAction = async (): Promise<ToggleNotificationApiResponse> => {
    try {
        const result = await toggleNotification();
        revalidatePath("/student");
        return result;
    } catch (error) {
        return createToggleNotificationErrorResponse(
            error,
            "알림 상태 변경에 실패했습니다."
        );
    }
};
