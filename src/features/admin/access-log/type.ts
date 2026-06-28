// 접근 로그 타입 정의

import { UserRole } from "@/features/user/type";

export type Action = "LOGIN" | "LOGOUT" | "FORBIDDEN";

export interface AccessLog {
    logId: number;
    userId?: number;
    userName?: string;
    userRole?: UserRole;
    ip: string;
    action: Action;
    accessedAt: string;
}

export interface AccessLogResponse {
    items: AccessLog[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}