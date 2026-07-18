"use server";

import {
    createGroupStudyService,
    getGroupStudyDetailService,
    updateGroupStudyTitleService,
    getMyGroupStudyListService,
    getSentStudyInviteListService,
    getMyStudyInviteListService,
    getTimerAvailabilityService,
    inviteStudyFriendService,
    cancelStudyInviteService,
    acceptStudyInviteService,
    denyStudyInviteService,
    startGroupStudyTimerService,
    pauseGroupStudyTimerService,
    stopGroupStudyTimerService,
    getGroupStudyLabListService,
    getGroupStudyDailyRankingService,
    getGroupStudyMonthlyRankingService,
    leaveGroupStudyService,
    kickGroupStudyMemberService,
    startSoloStudyTimerService,
    pauseSoloStudyTimerService,
    stopSoloStudyTimerService,
    getSoloStudyLabListService,
    getDailyStudyTimeService,
    getMonthlyStudyTimeService,
} from "@/app/services/study/service";
import type {
    StudyApiResponse,
    CreateGroupStudyRequest,
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
    UpdateGroupStudyTitleRequest,
    UpdateGroupStudyTitleResult,
    MyStudyInvitationItem,
    MySentStudyInvitationListResult,
    TimerAvailabilityResult,
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
    DailyStudyTimeResult,
    MonthlyStudyTimeResult,
} from "@/features/study/type";

const createStudyErrorResponse = <T>(
    error: unknown,
    fallbackMessage: string
): StudyApiResponse<T> => {
    const raw = error instanceof Error ? error.message : "";
    const [statusPart, messagePart] = raw.split("|");
    const statusCode = Number(statusPart);

    return {
        timestamp: new Date().toISOString(),
        statusCode: Number.isFinite(statusCode) ? statusCode : 500,
        code: "STUDY-ACTION-FAILED",
        message: messagePart || fallbackMessage,
        data: null as T,
    };
};

// 그룹방 생성
export const createGroupStudy = async (
    body: CreateGroupStudyRequest
): Promise<StudyApiResponse<GroupStudyInfo>> => {
    try {
        return await createGroupStudyService(body);
    } catch (error) {
        return createStudyErrorResponse<GroupStudyInfo>(error, "그룹방 생성에 실패했습니다.");
    }
};

// 그룹방 상세 조회
export const getGroupStudyDetail = async (
    roomId: number
): Promise<StudyApiResponse<GroupStudyDetail>> => {
    try {
        return await getGroupStudyDetailService(roomId);
    } catch (error) {
        return createStudyErrorResponse<GroupStudyDetail>(error, "그룹방 정보를 불러오지 못했습니다.");
    }
};

// 그룹방 제목 수정 (방장만 가능)
export const updateGroupStudyTitle = async (
    roomId: number,
    body: UpdateGroupStudyTitleRequest
): Promise<StudyApiResponse<UpdateGroupStudyTitleResult>> => {
    try {
        return await updateGroupStudyTitleService(roomId, body);
    } catch (error) {
        return createStudyErrorResponse<UpdateGroupStudyTitleResult>(error, "방 제목 수정에 실패했습니다.");
    }
};

// 내가 속한 그룹방 목록 조회
export const getMyGroupStudyList = async (): Promise<StudyApiResponse<MyGroupStudyRoomItem[]>> => {
    try {
        return await getMyGroupStudyListService();
    } catch (error) {
        return createStudyErrorResponse<MyGroupStudyRoomItem[]>(error, "내 그룹방 목록 조회에 실패했습니다.");
    }
};

// 내가 받은 초대 목록 조회
export const getMyStudyInviteList = async (): Promise<StudyApiResponse<MyStudyInvitationItem[]>> => {
    try {
        return await getMyStudyInviteListService();
    } catch (error) {
        return createStudyErrorResponse<MyStudyInvitationItem[]>(error, "받은 초대 목록 조회에 실패했습니다.");
    }
};

// 내가 방장으로서 보낸 초대 목록 조회
export const getSentStudyInviteList = async (): Promise<StudyApiResponse<MySentStudyInvitationListResult>> => {
    try {
        return await getSentStudyInviteListService();
    } catch (error) {
        return createStudyErrorResponse<MySentStudyInvitationListResult>(error, "보낸 초대 목록 조회에 실패했습니다.");
    }
};

// 타이머 시작 가능 여부 조회 (그룹방/솔로 세션 공용)
export const getTimerAvailability = async (): Promise<StudyApiResponse<TimerAvailabilityResult>> => {
    try {
        return await getTimerAvailabilityService();
    } catch (error) {
        return createStudyErrorResponse<TimerAvailabilityResult>(error, "타이머 시작 가능 여부 조회에 실패했습니다.");
    }
};

// 친구 초대 발송
export const inviteStudyFriend = async (
    roomId: number,
    body: InviteStudyFriendRequest
): Promise<StudyApiResponse<StudyInvitationSentResult>> => {
    try {
        return await inviteStudyFriendService(roomId, body);
    } catch (error) {
        return createStudyErrorResponse<StudyInvitationSentResult>(error, "초대 발송에 실패했습니다.");
    }
};

// 초대 취소
export const cancelStudyInvite = async (
    roomId: number,
    invitationId: number
): Promise<StudyApiResponse<StudyInvitationCancelResult>> => {
    try {
        return await cancelStudyInviteService(roomId, invitationId);
    } catch (error) {
        return createStudyErrorResponse<StudyInvitationCancelResult>(error, "초대 취소에 실패했습니다.");
    }
};

// 초대 수락
export const acceptStudyInvite = async (
    roomId: number
): Promise<StudyApiResponse<StudyInvitationAcceptResult>> => {
    try {
        return await acceptStudyInviteService(roomId);
    } catch (error) {
        return createStudyErrorResponse<StudyInvitationAcceptResult>(error, "초대 수락에 실패했습니다.");
    }
};

// 초대 거절
export const denyStudyInvite = async (
    roomId: number
): Promise<StudyApiResponse<StudyInvitationRejectResult>> => {
    try {
        return await denyStudyInviteService(roomId);
    } catch (error) {
        return createStudyErrorResponse<StudyInvitationRejectResult>(error, "초대 거절에 실패했습니다.");
    }
};

// 그룹방 타이머 시작
export const startGroupStudyTimer = async (
    roomId: number
): Promise<StudyApiResponse<GroupStudyTimerStartResult>> => {
    try {
        return await startGroupStudyTimerService(roomId);
    } catch (error) {
        return createStudyErrorResponse<GroupStudyTimerStartResult>(error, "타이머 시작에 실패했습니다.");
    }
};

// 그룹방 타이머 일시정지
export const pauseGroupStudyTimer = async (
    roomId: number
): Promise<StudyApiResponse<GroupStudyTimerPauseResult>> => {
    try {
        return await pauseGroupStudyTimerService(roomId);
    } catch (error) {
        return createStudyErrorResponse<GroupStudyTimerPauseResult>(error, "타이머 일시정지에 실패했습니다.");
    }
};

// 그룹방 타이머 종료
export const stopGroupStudyTimer = async (
    roomId: number
): Promise<StudyApiResponse<GroupStudyTimerEndResult>> => {
    try {
        return await stopGroupStudyTimerService(roomId);
    } catch (error) {
        return createStudyErrorResponse<GroupStudyTimerEndResult>(error, "타이머 종료에 실패했습니다.");
    }
};

// 그룹방 멤버 랩 목록 조회
export const getGroupStudyLabList = async (
    roomId: number,
    targetUserId: number
): Promise<StudyApiResponse<GroupStudyMemberLapsResult>> => {
    try {
        return await getGroupStudyLabListService(roomId, targetUserId);
    } catch (error) {
        return createStudyErrorResponse<GroupStudyMemberLapsResult>(error, "랩 목록 조회에 실패했습니다.");
    }
};

// 그룹 멤버 일별 랭킹 조회
export const getGroupStudyDailyRanking = async (
    roomId: number
): Promise<StudyApiResponse<GroupStudyDailyRankingResult>> => {
    try {
        return await getGroupStudyDailyRankingService(roomId);
    } catch (error) {
        return createStudyErrorResponse<GroupStudyDailyRankingResult>(error, "일별 랭킹 조회에 실패했습니다.");
    }
};

// 그룹 멤버 월별 랭킹 조회
export const getGroupStudyMonthlyRanking = async (
    roomId: number
): Promise<StudyApiResponse<GroupStudyMonthlyRankingResult>> => {
    try {
        return await getGroupStudyMonthlyRankingService(roomId);
    } catch (error) {
        return createStudyErrorResponse<GroupStudyMonthlyRankingResult>(error, "월별 랭킹 조회에 실패했습니다.");
    }
};

// 그룹방 나가기
export const leaveGroupStudy = async (
    roomId: number
): Promise<StudyApiResponse<GroupStudyLeaveResult>> => {
    try {
        return await leaveGroupStudyService(roomId);
    } catch (error) {
        return createStudyErrorResponse<GroupStudyLeaveResult>(error, "그룹방 나가기에 실패했습니다.");
    }
};

// 그룹방 내보내기
export const kickGroupStudyMember = async (
    roomId: number,
    targetUserId: number
): Promise<StudyApiResponse<GroupStudyKickResult>> => {
    try {
        return await kickGroupStudyMemberService(roomId, targetUserId);
    } catch (error) {
        return createStudyErrorResponse<GroupStudyKickResult>(error, "멤버 내보내기에 실패했습니다.");
    }
};

// 개인 타이머 시작
export const startSoloStudyTimer = async (): Promise<StudyApiResponse<SoloStudyTimerStartResult>> => {
    try {
        return await startSoloStudyTimerService();
    } catch (error) {
        return createStudyErrorResponse<SoloStudyTimerStartResult>(error, "솔로 타이머 시작에 실패했습니다.");
    }
};

// 개인 타이머 일시정지
export const pauseSoloStudyTimer = async (): Promise<StudyApiResponse<SoloStudyTimerPauseResult>> => {
    try {
        return await pauseSoloStudyTimerService();
    } catch (error) {
        return createStudyErrorResponse<SoloStudyTimerPauseResult>(error, "솔로 타이머 일시정지에 실패했습니다.");
    }
};

// 개인 타이머 종료
export const stopSoloStudyTimer = async (): Promise<StudyApiResponse<SoloStudyTimerEndResult>> => {
    try {
        return await stopSoloStudyTimerService();
    } catch (error) {
        return createStudyErrorResponse<SoloStudyTimerEndResult>(error, "솔로 타이머 종료에 실패했습니다.");
    }
};

// 개인 랩 목록 조회
export const getSoloStudyLabList = async (): Promise<StudyApiResponse<SoloStudyLapsResult>> => {
    try {
        return await getSoloStudyLabListService();
    } catch (error) {
        return createStudyErrorResponse<SoloStudyLapsResult>(error, "랩 목록 조회에 실패했습니다.");
    }
};

// 일별 누적 공부시간 조회
export const getDailyStudyTime = async (
    date: string
): Promise<StudyApiResponse<DailyStudyTimeResult>> => {
    try {
        return await getDailyStudyTimeService(date);
    } catch (error) {
        return createStudyErrorResponse<DailyStudyTimeResult>(error, "일별 누적 공부시간 조회에 실패했습니다.");
    }
};

// 월별 누적 공부시간 조회
export const getMonthlyStudyTime = async (
    yearMonth: string
): Promise<StudyApiResponse<MonthlyStudyTimeResult>> => {
    try {
        return await getMonthlyStudyTimeService(yearMonth);
    } catch (error) {
        return createStudyErrorResponse<MonthlyStudyTimeResult>(error, "월별 누적 공부시간 조회에 실패했습니다.");
    }
};
