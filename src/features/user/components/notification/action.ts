"use server";

import {
    getNoticeAppCountsService,
    getNoticeNotificationListService,
    getNoticeTotalCountsService,
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
            return await getNoticeNotificationListService();
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
