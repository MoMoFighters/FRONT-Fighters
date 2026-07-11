// 공용

import { Category } from "../lecture/type";
import { TargetType } from "../report/type";

// 회원상태
export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'PENDING' | 'REJECTED' | 'BANNED' | 'BLACK' | 'DELETED';
export type UserCategory = 'FITNESS' | 'STUDY' | 'COOK' | 'BEAUTY' | 'ART';
export type Membership = "BASIC" | "PLUS" | "PRO";

export const USER_ROLE_LABEL: Record<UserRole, string> = {
    STUDENT: "수강생",
    TEACHER: "강사",
    ADMIN: "관리자",
};

export interface User {
    id: number;
    name: string;
    nickname: string | null;
    role: UserRole;
    status: UserStatus;
    email: string | null;
    createdAt: string;
    profileImageUrl: string;
    isTempPwd: boolean;
    doNotDisturb: boolean;
    isPaid: boolean;
    membership: Membership;
    membershipStart: string;

    deletedAt?: string;
    proof?: string[]; // 증빙자료 url
    category?: UserCategory;
}


// ==========================================
// 관리자 회원 관리
// ==========================================


// 관리자 회원 조회 타입 정의

export interface UserList {
    userId: number;
    name: string;
    role: UserRole;
    email: string;
    createdAt: string;
    status: UserStatus;
    suspensionCount: number | null;
    suspendedUntil: string | null;
    membership: Membership;
}

export type UserResponse = UserList & {
    deletedAt?: string;
    proof?: string;
};

export interface UserListRequest {
    role?: string;
    status?: string;
    keyword?: string;
    page?: string;
}

export interface UserListResponse {
    users: UserList[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export interface ReportByUser {
    targetType: TargetType;
    content: string | null;
    createdAt: string;
    isResolved: boolean;
}

export interface userDetail {
    email: string;
    role: UserRole;
    createdAt: string;
    category?: Category | null;
    name: string;
    suspensionCount?: number | null;
    reports: ReportByUser[];
    membership: Membership;
    membershipStart: string;
}

// 관리자 대기 강사 조회 타입 정의
export interface PendingTeacherList {
    userId: number;
    name: string;
    nickname: string;
    role: UserRole;
    email: string;
    category: Category;
    createdAt: string;
    status: UserStatus;
    suspensionCount: number | null;
    suspendedUntil: string | null;
}

export interface PendingTeacherListRequest {
    keyword?: string;
    page?: string;
}

export interface PendingTeacherListResponse {
    applications: PendingTeacherList[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export interface PendingTeacherDetail {
    userId: number;
    name: string;
    nickname: string;
    role: UserRole;
    email: string;
    profileImageUrl: string;
    category: Category;
    createdAt: string;
    proof: string;
    fileType: "pdf" | "mp4";
}

// 

export interface UpdateTeacherStatusRequest {
    action: string;
    reason: string;
}

export interface UpdateTeacherStatusResponse {
    userId: number;
    status: string;
    reason: string | null;
    processedAt: string;
}
