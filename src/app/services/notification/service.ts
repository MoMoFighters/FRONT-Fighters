import { fetchWithAuth } from "@/lib/api";
import {
    NoticeAppCountsResponse,
    NoticeNotificationListResponse,
    NoticeTotalCountsResponse,
} from "@/features/user/components/notification/type";

export const getNoticeTotalCountsService =
    async (): Promise<NoticeTotalCountsResponse> => {
        const response = await fetchWithAuth("/api/v2/notice/total-counts", {
            method: "GET",
        });

        const result: NoticeTotalCountsResponse = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "알림 개수를 불러오지 못했습니다.");
        }

        return result;
    };

export const getNoticeNotificationListService =
    async (): Promise<NoticeNotificationListResponse> => {
        const response = await fetchWithAuth("/api/v2/notice/notificationlist", {
            method: "GET",
        });

        const result: NoticeNotificationListResponse = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "알림 목록을 불러오지 못했습니다.");
        }

        return result;
    };

export const getNoticeAppCountsService =
    async (): Promise<NoticeAppCountsResponse> => {
        const response = await fetchWithAuth("/api/v2/notice/app-counts", {
            method: "GET",
        });

        const result: NoticeAppCountsResponse = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "앱별 알림 개수를 불러오지 못했습니다.");
        }

        return result;
    };
