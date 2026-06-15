import type { ApiResponse } from "@/lib/api";

const BASE_SERVER_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL;


// ==========================================
// 공통 요청 처리
// ==========================================

const requestApi = async <T>(
    url: string,
    options: RequestInit,
    fallbackMessage: string
): Promise<ApiResponse<T>> => {
    const response = await fetch(url, options);

    const result: ApiResponse<T> =
        await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || fallbackMessage
        );
    }

    return result;
};


// ==========================================
// 1. 사용자 검색
// GET /api/v1/friends/find?nickname={nickname}
// ==========================================

export interface SearchedUserData {
    userId: number;
    name: string;
    nickname: string;
    role: "STUDENT" | "TEACHER";
    status:
    | "none"
    | "SENT"
    | "FRIEND"
    | "RECEIVED"
    | "BLOCK";
    profileImageUrl: string;
    lectureTitle?: string;
}

export const searchUserService = async (
    nickname: string,
    accessToken: string
): Promise<ApiResponse<SearchedUserData[]>> => {
    return requestApi<SearchedUserData[]>(
        `${BASE_SERVER_URL}/api/v1/friends/find?nickname=${encodeURIComponent(nickname)}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
        "사용자 검색에 실패했습니다."
    );
};


// ==========================================
// 2. 친구 목록 조회
// GET /api/v1/friends
// ==========================================

export interface FriendData {
    userId: number;
    name?: string;
    nickname: string;
    lectureTitle?: string;
    role: "STUDENT" | "TEACHER";
    status: "FRIEND";
    profileImageUrl?: string;
}

export const getFriendsService = async (
    accessToken: string
): Promise<ApiResponse<FriendData[]>> => {
    return requestApi<FriendData[]>(
        `${BASE_SERVER_URL}/api/v1/friends`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
        "친구 목록을 불러오지 못했습니다."
    );
};


// ==========================================
// 3. 받은 친구 요청 목록 조회
// GET /api/v1/friends/received
// ==========================================

export interface ReceivedFriendRequestData {
    userId: number;
    nickname: string;
    role: "STUDENT" | "TEACHER";
    status: "RECEIVED";
    profileImageUrl: string;
    lectureTitle?: string;
}

export const getReceivedFriendRequestsService = async (
    accessToken: string
): Promise<ApiResponse<ReceivedFriendRequestData[]>> => {
    return requestApi<ReceivedFriendRequestData[]>(
        `${BASE_SERVER_URL}/api/v1/friends/received`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
        "받은 친구 요청을 불러오지 못했습니다."
    );
};


// ==========================================
// 4. 보낸 친구 요청 목록 조회
// GET /api/v1/friends/sent
// ==========================================

export interface SentFriendRequestData {
    userId: number;
    nickname: string;
    role: "STUDENT" | "TEACHER";
    status: "SENT";
    profileImageUrl: string;
    lectureTitle?: string;
}

export const getSentFriendRequestsService = async (
    accessToken: string
): Promise<ApiResponse<SentFriendRequestData[]>> => {
    return requestApi<SentFriendRequestData[]>(
        `${BASE_SERVER_URL}/api/v1/friends/sent`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
        "보낸 친구 요청을 불러오지 못했습니다."
    );
};


// ==========================================
// 5. 차단 사용자 목록 조회
// GET /api/v1/friends/blocked
// ==========================================

export interface BlockedFriendData {
    userId: number;
    nickname: string;
    role: "STUDENT" | "TEACHER";
    status: "BLOCK";
    profileImageUrl?: string;
}

export const getBlockedFriendsService = async (
    accessToken: string
): Promise<ApiResponse<BlockedFriendData[]>> => {
    return requestApi<BlockedFriendData[]>(
        `${BASE_SERVER_URL}/api/v1/friends/blocked`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
        "차단 목록을 불러오지 못했습니다."
    );
};


// ==========================================
// 6. 친구 요청 전송
// POST /api/v1/friends/request/{userId}
// ==========================================

export interface FriendStatusData {
    userId: number;
    status:
    | "SENT"
    | "RECEIVED"
    | "FRIEND"
    | "BLOCK"
    | "NONE";
}

export const sendFriendRequestService = async (
    userId: number,
    accessToken: string
): Promise<ApiResponse<FriendStatusData>> => {
    return requestApi<FriendStatusData>(
        `${BASE_SERVER_URL}/api/v1/friends/request/${userId}`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
        "친구 요청에 실패했습니다."
    );
};


// ==========================================
// 7. 보낸 친구 요청 취소
// DELETE /api/v1/friends/request/{userId}
// ==========================================

export const cancelFriendRequestService = async (
    userId: number,
    accessToken: string
): Promise<ApiResponse<FriendStatusData>> => {
    return requestApi<FriendStatusData>(
        `${BASE_SERVER_URL}/api/v1/friends/request/${userId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
        "친구 요청 취소에 실패했습니다."
    );
};


// ==========================================
// 8. 받은 친구 요청 수락
// PATCH /api/v1/friends/received/{userId}/accept
// ==========================================

export const acceptFriendRequestService = async (
    userId: number,
    accessToken: string
): Promise<ApiResponse<FriendStatusData>> => {
    return requestApi<FriendStatusData>(
        `${BASE_SERVER_URL}/api/v1/friends/received/${userId}/accept`,
        {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
        "친구 요청 수락에 실패했습니다."
    );
};


// ==========================================
// 9. 받은 친구 요청 거절
// DELETE /api/v1/friends/received/{userId}/reject
// ==========================================

export const rejectFriendRequestService = async (
    userId: number,
    accessToken: string
): Promise<ApiResponse<FriendStatusData>> => {
    return requestApi<FriendStatusData>(
        `${BASE_SERVER_URL}/api/v1/friends/received/${userId}/reject`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
        "친구 요청 거절에 실패했습니다."
    );
};


// ==========================================
// 10. 친구 차단
// PATCH /api/v1/friends/block/{userId}
// ==========================================

export const blockFriendService = async (
    userId: number,
    accessToken: string
): Promise<ApiResponse<FriendStatusData>> => {
    return requestApi<FriendStatusData>(
        `${BASE_SERVER_URL}/api/v1/friends/block/${userId}`,
        {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
        "친구 차단에 실패했습니다."
    );
};


// ==========================================
// 11. 친구 차단 해제
// PATCH /api/v1/friends/unblock/{userId}
// ==========================================

export const unblockFriendService = async (
    userId: number,
    accessToken: string
): Promise<ApiResponse<FriendStatusData>> => {
    return requestApi<FriendStatusData>(
        `${BASE_SERVER_URL}/api/v1/friends/unblock/${userId}`,
        {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
        "친구 차단 해제에 실패했습니다."
    );
};


// ==========================================
// 12. 친구 삭제
// DELETE /api/v1/friends/delete/{userId}
// ==========================================

export const deleteFriendService = async (
    userId: number,
    accessToken: string
): Promise<ApiResponse<FriendStatusData>> => {
    return requestApi<FriendStatusData>(
        `${BASE_SERVER_URL}/api/v1/friends/delete/${userId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
        "친구 삭제에 실패했습니다."
    );
};