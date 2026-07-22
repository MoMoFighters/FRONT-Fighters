import { fetchWithAuth } from "@/lib/api";
import type {
    StudyApiResponse,
    GroupStudyInfo,
    CreateGroupStudyRequest,
    UpdateGroupStudyTitleRequest,
    GroupStudyTitleUpdateResult,
    GroupStudyDetail,
    MyGroupStudyRoomListResult,
    GroupStudyLeaveResult,
    GroupStudyKickResult,
    InviteStudyFriendRequest,
    StudyInvitationSentResult,
    StudyInvitationCancelResult,
    StudyInvitationAcceptResult,
    StudyInvitationRejectResult,
    MyStudyInvitationListResult,
    SentStudyInvitationListResult,
    GroupStudyTimerStartResult,
    GroupStudyTimerPauseResult,
    GroupStudyTimerEndResult,
    GroupStudyMemberLapsResult,
    StudyRankingResult,
    TimerAvailabilityResult,
    SoloStudyTimerStartResult,
    SoloStudyTimerPauseResult,
    SoloStudyTimerEndResult,
    SoloStudyLapsResult,
    SoloCurrentSessionResult,
    DailyStudyTimeResult,
    MonthlyStudyTimeResult,
    YearlyStudyRecordResult,
} from "@/features/study/type";

// ====================
// Group Study
// ====================

// 그룹 스터디룸 실시간 구독 destination (STOMP)
export const getStudyRoomSubscribeDestination = (roomId: number) =>
    `/sub/study/room/${roomId}`;

// 그룹방 생성 (title 필수 - CreateGroupRoomRequest.title @NotBlank)
export const createGroupStudyService = async (
    body: CreateGroupStudyRequest
): Promise<StudyApiResponse<GroupStudyInfo>> => {
    const response = await fetchWithAuth("/api/v3/study/rooms", {
        method: "POST",
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.status}|${errorData.message}` || "500|알 수 없는 오류가 발생했습니다")
    }
    return response.json();
};


// 그룹방 제목 수정 (방장만 가능)
export const updateGroupStudyTitleService = async (
    roomId: number,
    body: UpdateGroupStudyTitleRequest
): Promise<StudyApiResponse<GroupStudyTitleUpdateResult>> => {
    const response = await fetchWithAuth(`/api/v3/study/rooms/${roomId}`, {
        method: "PATCH",
        body: JSON.stringify(body),
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
export const getMyGroupStudyListService = async (): Promise<StudyApiResponse<MyGroupStudyRoomListResult>> => {
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
export const getMyStudyInviteListService = async (): Promise<StudyApiResponse<MyStudyInvitationListResult>> => {
    const response = await fetchWithAuth("/api/v3/study/members/invitations");

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.status}|${errorData.message}` || "500|알 수 없는 오류가 발생했습니다")
    }
    return response.json();
};


// 내가 보낸 초대 목록 조회
export const getSentStudyInviteListService = async (): Promise<StudyApiResponse<SentStudyInvitationListResult>> => {
    const response = await fetchWithAuth("/api/v3/study/members/invitations/sent");

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
    const response = await fetchWithAuth(`/api/v3/study/rooms/${roomId}/members/timer/${targetUserId}/laps`);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.status}|${errorData.message}` || "500|알 수 없는 오류가 발생했습니다")
    }
    return response.json();
};


// 그룹 멤버 일별 랭킹 조회 (일별/월별 공용 응답 형태 - RankingResponse)
export const getGroupStudyDailyRankingService = async (
    roomId: number
): Promise<StudyApiResponse<StudyRankingResult>> => {
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
): Promise<StudyApiResponse<StudyRankingResult>> => {
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
// ⚠️ 제거함: 백엔드에 진짜 이력 조회 엔드포인트가 없음 (SoloController에 매핑 없음, repository 주석에만 "용도" 언급).
// 이전에 "/solo/laps"로 임시 연결했었지만 그건 getSoloStudyLabListService와 완전히 같은 엔드포인트라
// {sessionId, laps} 객체가 내려오는데 타입은 배열(SoloStudyHistoryItem[])로 선언돼 있어 런타임에 깨짐.
// 백엔드에 실제 "/api/v3/study/solo/history" 컨트롤러가 추가되면 그때 다시 구현.


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


// 연간 누적 공부시간 조회 (잔디 히트맵용)
export const getYearlyStudyTimeService = async (): Promise<StudyApiResponse<YearlyStudyRecordResult>> => {
    const response = await fetchWithAuth("/api/v3/study/records/yearly", {
        next: { revalidate: 300 },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.status}|${errorData.message}` || "500|알 수 없는 오류가 발생했습니다")
    }
    return response.json();
};


// ====================
// Timer Availability (기존 프론트에 없던 엔드포인트)
// ====================

// 타이머 시작 가능 여부 조회
export const getTimerAvailabilityService = async (): Promise<StudyApiResponse<TimerAvailabilityResult>> => {
    const response = await fetchWithAuth("/api/v3/study/timer-availability");

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${errorData.status}|${errorData.message}` || "500|알 수 없는 오류가 발생했습니다")
    }
    return response.json();
};
