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
    | "STUDY_INVITE"
    | string;

export interface NoticeNotification {
    notificationId: number;
    type: NoticeNotificationType;
    message: string;
    isRead: boolean;
    refId: number;
    createdAt: string;
}

export type NoticeNotificationListResponse =
    ApiResponse<NoticeNotification[]>;

export interface NoticeAppCountsData {
    totalMsgFriendCount: number;
    calendarCount: number;
    communityCount: number;
    studyCount: number;
}

export interface NoticeAppCountsResponse {
    success?: boolean;
    statusCode?: number;
    timestamp?: string;
    status?: number;
    code?: string;
    message: string;
    data?: NoticeAppCountsData | null;
    errors?: Record<string, unknown>;
}

export interface ToggleNotificationResponse {
    do_not_disturb: boolean
}

export type ToggleNotificationApiResponse =
    ApiResponse<ToggleNotificationResponse>;
