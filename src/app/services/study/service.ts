import { fetchWithAuth } from "@/lib/api";
import type {
    StudyApiResponse,
    GroupStudyInfo,
    GroupStudyDetail,
    MyGroupStudyRoomItem,
    GroupStudyLeaveResult,
    GroupStudyKickResult,
    InviteStudyFriendRequest,
    StudyInvitationSentResult,
    StudyInvitationCancelResult,
    StudyInvitationAcceptResult,
    StudyInvitationRejectResult,
    MyStudyInvitationItem,
    GroupStudyTimerStartResult,
    GroupStudyTimerPauseResult,
    GroupStudyTimerEndResult,
    GroupStudyMemberLapsResult,
    GroupStudyDailyRankingResult,
    GroupStudyMonthlyRankingResult,
    SoloStudyTimerStartResult,
    SoloStudyTimerPauseResult,
    SoloStudyTimerEndResult,
    SoloStudyLapsResult,
    SoloCurrentSessionResult,
    SoloStudyHistoryItem,
    DailyStudyTimeResult,
    MonthlyStudyTimeResult,
} from "@/features/study/type";

// ====================
// Group Study
// ====================

// 그룹방 생성
export const createGroupStudyService = async (): Promise<StudyApiResponse<GroupStudyInfo>> => {
    const response = await fetchWithAuth("/api/v3/study/rooms", {
        method: "POST",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.status}|${errorData.message}` || "500|알 수 없는 오류가 발생했습니다")
    }
    return response.json();
};


// 그룹방 상세 조회 body:x, queryString:roomId(number)
export const getGroupStudyDetailService = async (
    roomId: number
): Promise<StudyApiResponse<GroupStudyDetail>> => {
    const response = await fetchWithAuth(`/api/v3/study/rooms/${roomId}`);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.status}|${errorData.message}` || "500|알 수 없는 오류가 발생했습니다")
    }
    return response.json();
};


// 내가 속한 그룹방 목록 조회
export const getMyGroupStudyListService = async (): Promise<StudyApiResponse<MyGroupStudyRoomItem[]>> => {
    const response = await fetchWithAuth("/api/v3/study/rooms/my");

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.status}|${errorData.message}` || "500|알 수 없는 오류가 발생했습니다")
    }
    return response.json();
};


// 그룹방 나가기
export const leaveGroupStudyService = async (
    roomId: number
): Promise<StudyApiResponse<GroupStudyLeaveResult>> => {
    const response = await fetchWithAuth(`/api/v3/study/rooms/${roomId}/members/leave`, {
        method: "POST",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.status}|${errorData.message}` || "500|알 수 없는 오류가 발생했습니다")
    }
    return response.json();
};


// 그룹방 멤버 내보내기
export const kickGroupStudyMemberService = async (
    roomId: number,
    targetUserId: number
): Promise<StudyApiResponse<GroupStudyKickResult>> => {
    const response = await fetchWithAuth(`/api/v3/study/rooms/${roomId}/members/${targetUserId}/kick`, {
        method: "POST",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.status}|${errorData.message}` || "500|알 수 없는 오류가 발생했습니다")
    }
    return response.json();
};


// ====================
// Group Invite
// ====================

// 친구 초대 발송
export const inviteStudyFriendService = async (
    roomId: number,
    body: InviteStudyFriendRequest
): Promise<StudyApiResponse<StudyInvitationSentResult>> => {
    const response = await fetchWithAuth(`/api/v3/study/rooms/${roomId}/members/invitations`, {
        method: "POST",
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.status}|${errorData.message}` || "500|알 수 없는 오류가 발생했습니다")
    }
    return response.json();
};


// 초대 취소
export const cancelStudyInviteService = async (
    roomId: number,
    invitationId: number
): Promise<StudyApiResponse<StudyInvitationCancelResult>> => {
    const response = await fetchWithAuth(`/api/v3/study/rooms/${roomId}/members/invitations/${invitationId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.status}|${errorData.message}` || "500|알 수 없는 오류가 발생했습니다")
    }
    return response.json();
};


// 초대 수락
export const acceptStudyInviteService = async (
    roomId: number
): Promise<StudyApiResponse<StudyInvitationAcceptResult>> => {
    const response = await fetchWithAuth(`/api/v3/study/rooms/${roomId}/members/invitations/accept`, {
        method: "POST",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.status}|${errorData.message}` || "500|알 수 없는 오류가 발생했습니다")
    }
    return response.json();
};


// 초대 거절
export const denyStudyInviteService = async (
    roomId: number
): Promise<StudyApiResponse<StudyInvitationRejectResult>> => {
    const response = await fetchWithAuth(`/api/v3/study/rooms/${roomId}/members/invitations/reject`, {
        method: "POST",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.status}|${errorData.message}` || "500|알 수 없는 오류가 발생했습니다")
    }
    return response.json();
};


// 내가 받은 초대 목록 조회
export const getMyStudyInviteListService = async (): Promise<StudyApiResponse<MyStudyInvitationItem[]>> => {
    const response = await fetchWithAuth("/api/v3/study/members/invitations");

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.status}|${errorData.message}` || "500|알 수 없는 오류가 발생했습니다")
    }
    return response.json();
};


// ====================
// Group Timer
// ====================

// 그룹 타이머 시작
export const startGroupStudyTimerService = async (
    roomId: number
): Promise<StudyApiResponse<GroupStudyTimerStartResult>> => {
    const response = await fetchWithAuth(`/api/v3/study/rooms/${roomId}/members/timer/start`, {
        method: "POST",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.status}|${errorData.message}` || "500|알 수 없는 오류가 발생했습니다")
    }
    return response.json();
};


// 그룹 타이머 일시정지
export const pauseGroupStudyTimerService = async (
    roomId: number
): Promise<StudyApiResponse<GroupStudyTimerPauseResult>> => {
    const response = await fetchWithAuth(`/api/v3/study/rooms/${roomId}/members/timer/pause`, {
        method: "POST",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.status}|${errorData.message}` || "500|알 수 없는 오류가 발생했습니다")
    }
    return response.json();
};


// 그룹 타이머 종료
export const stopGroupStudyTimerService = async (
    roomId: number
): Promise<StudyApiResponse<GroupStudyTimerEndResult>> => {
    const response = await fetchWithAuth(`/api/v3/study/rooms/${roomId}/members/timer/end`, {
        method: "POST",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.status}|${errorData.message}` || "500|알 수 없는 오류가 발생했습니다")
    }
    return response.json();
};


// ====================
// Group Statistics
// ====================

// 그룹 멤버 랩 목록 조회
export const getGroupStudyLabListService = async (
    roomId: number,
    targetUserId: number
): Promise<StudyApiResponse<GroupStudyMemberLapsResult>> => {
    const response = await fetchWithAuth(`/api/v3/study/rooms/${roomId}/members/${targetUserId}/laps`);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.status}|${errorData.message}` || "500|알 수 없는 오류가 발생했습니다")
    }
    return response.json();
};


// 그룹 멤버 일별 랭킹 조회
export const getGroupStudyDailyRankingService = async (
    roomId: number
): Promise<StudyApiResponse<GroupStudyDailyRankingResult>> => {
    const response = await fetchWithAuth(`/api/v3/study/rooms/${roomId}/ranking/daily`);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.status}|${errorData.message}` || "500|알 수 없는 오류가 발생했습니다")
    }
    return response.json();
};


// 그룹 멤버 월별 랭킹 조회
export const getGroupStudyMonthlyRankingService = async (
    roomId: number
): Promise<StudyApiResponse<GroupStudyMonthlyRankingResult>> => {
    const response = await fetchWithAuth(`/api/v3/study/rooms/${roomId}/ranking/monthly`);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.status}|${errorData.message}` || "500|알 수 없는 오류가 발생했습니다")
    }
    return response.json();
};


// ====================
// Solo Study
// ====================

// 개인 타이머 시작
export const startSoloStudyTimerService = async (): Promise<StudyApiResponse<SoloStudyTimerStartResult>> => {
    const response = await fetchWithAuth("/api/v3/study/solo/start", {
        method: "POST",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.status}|${errorData.message}` || "500|알 수 없는 오류가 발생했습니다")
    }
    return response.json();
};


// 개인 타이머 일시정지
export const pauseSoloStudyTimerService = async (): Promise<StudyApiResponse<SoloStudyTimerPauseResult>> => {
    const response = await fetchWithAuth("/api/v3/study/solo/pause", {
        method: "POST",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.status}|${errorData.message}` || "500|알 수 없는 오류가 발생했습니다")
    }
    return response.json();
};


// 개인 타이머 종료
export const stopSoloStudyTimerService = async (): Promise<StudyApiResponse<SoloStudyTimerEndResult>> => {
    const response = await fetchWithAuth("/api/v3/study/solo/end", {
        method: "POST",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.status}|${errorData.message}` || "500|알 수 없는 오류가 발생했습니다")
    }
    return response.json();
};


// ====================
// Solo Statistics
// ====================

// 개인 랩 목록 조회
export const getSoloStudyLabListService = async (): Promise<StudyApiResponse<SoloStudyLapsResult>> => {
    const response = await fetchWithAuth("/api/v3/study/solo/laps");

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.status}|${errorData.message}` || "500|알 수 없는 오류가 발생했습니다")
    }
    return response.json();
};


// 현재 진행 중인 솔로 세션 조회
export const getCurrentSoloStudySessionService = async (): Promise<StudyApiResponse<SoloCurrentSessionResult | null>> => {
    const response = await fetchWithAuth("/api/v3/study/solo/current");

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.status}|${errorData.message}` || "500|알 수 없는 오류가 발생했습니다")
    }
    return response.json();
};


// 솔로 세션 이력 조회
export const getSoloStudyHistoryService = async (): Promise<StudyApiResponse<SoloStudyHistoryItem[]>> => {
    const response = await fetchWithAuth("/api/v3/study/solo/history");

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.status}|${errorData.message}` || "500|알 수 없는 오류가 발생했습니다")
    }
    return response.json();
};


// 일별 누적 공부시간 조회
export const getDailyStudyTimeService = async (
    date: string
): Promise<StudyApiResponse<DailyStudyTimeResult>> => {
    const response = await fetchWithAuth(`/api/v3/study/records/daily?date=${encodeURIComponent(date)}`);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.status}|${errorData.message}` || "500|알 수 없는 오류가 발생했습니다")
    }
    return response.json();
};


// 월별 누적 공부시간 조회
export const getMonthlyStudyTimeService = async (
    yearMonth: string
): Promise<StudyApiResponse<MonthlyStudyTimeResult>> => {
    const response = await fetchWithAuth(`/api/v3/study/records/monthly?yearMonth=${encodeURIComponent(yearMonth)}`);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.status}|${errorData.message}` || "500|알 수 없는 오류가 발생했습니다")
    }
    return response.json();
};
