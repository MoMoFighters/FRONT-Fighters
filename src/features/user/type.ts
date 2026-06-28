// 공용
// 회원상태
export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'PENDING' | 'REJECTED' | 'BANNED' | 'BLACK' | 'DELETED';
export type UserCategory = 'FITNESS' | 'STUDY' | 'COOK' | 'BEAUTY' | 'ART';

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

    deletedAt?: string;
    proof?: string[]; // 증빙자료 url
    category?: UserCategory;

    // 🍑🍑🍑상의 필요🍑🍑🍑
    // 멤버십 마감 되는 날짜
}


// 관리자 회원 전체 조회 타입 정의

export interface GetUsersRequest {
    role?: string;
    status?: string;
    keyword?: string;
    page?: string;
}

export interface GetUsersResponse {
    users: UserResponse[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export interface UserResponse {
    id: number,
    name: string,
    role: string,
    email: string,
    createdAt?: string,
    deletedAt?: string,
    status?: string,
    proof?: string
}

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
