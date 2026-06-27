import type { ApiResponse } from "@/lib/api";

export interface NoticeTotalCountsData {
    totalCount: number;
}

export type NoticeTotalCountsResponse =
    ApiResponse<NoticeTotalCountsData>;

export type NoticeNotificationType =
    | "MESSAGE"
    | "FRIEND_REQUEST"
    | "COMMUNITY"
    | "CALENDAR"
    | string;

export interface NoticeNotification {
    id: number;
    type: NoticeNotificationType;
    message: string;
    isRead: boolean;
    refId: number;
    createdAt: string;
}

export type NoticeNotificationListResponse =
    ApiResponse<NoticeNotification[]>;
