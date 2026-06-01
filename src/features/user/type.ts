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