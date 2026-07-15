"use server";

import { revalidatePath } from "next/cache";
import {
    deleteNoticeService,
    getNoticeAppCountsService,
    getNoticeNotificationListService,
    getNoticeTotalCountsService,
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

export const getNoticeTotalCountsAction =
    async (): Promise<NoticeTotalCountsResponse> => {
        try {
            return await getNoticeTotalCountsService();
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
