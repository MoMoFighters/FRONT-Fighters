import { fetchWithAuth } from "@/lib/api";
import type { ApiResponse } from "@/lib/api";
import {
    NoticeAppCountsResponse,
    NoticeNotificationListResponse,
    NoticeTotalCountsResponse,
    ToggleNotificationResponse,
} from "@/features/user/components/notification/type";

export type NoticeMutationResponse = ApiResponse<[]>;

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

const updateNoticeTargetsService = async (
    endpoint: string,
    targetId: number[],
    method: "PATCH" | "DELETE" = "PATCH"
): Promise<NoticeMutationResponse> => {
    const response = await fetchWithAuth(endpoint, {
        method,
        body: JSON.stringify({
            targetId,
        }),
    });

    const result: NoticeMutationResponse = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "알림 처리에 실패했습니다.");
    }

    return result;
};

export const readNoticeService = async (
    targetId: number[]
): Promise<NoticeMutationResponse> =>
    updateNoticeTargetsService("/api/v2/notice/read", targetId);

export const deleteNoticeService = async (
    targetId: number[]
): Promise<NoticeMutationResponse> =>
    updateNoticeTargetsService("/api/v2/notice/remove", targetId, "DELETE");


export const toggleNotification = async (): Promise<ApiResponse<ToggleNotificationResponse>> => {
    const response = await fetchWithAuth("/api/v1/user/settings/alarm", { method: "PATCH" });
    const result = await response.json();
    console.log(result)

    if (!response.ok) {
        throw new Error(result.message || "알림 상태 변경 처리에 실패했습니다.");
    }

    return result;
}