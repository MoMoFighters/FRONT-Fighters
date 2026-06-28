"use server";

import { revalidatePath } from "next/cache";
import {
    deleteNoticeService,
    getNoticeAppCountsService,
    getNoticeNotificationListService,
    getNoticeTotalCountsService,
    readNoticeService,
    type NoticeMutationResponse,
} from "@/app/services/notification/service";
import {
    NoticeAppCountsResponse,
    NoticeNotificationListResponse,
    NoticeTotalCountsResponse,
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
            const a = await getNoticeNotificationListService();
            console.log(a)
            return a
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
