"use server";

import {
    createGroupStudyService,
    inviteStudyFriendService,
    cancelStudyInviteService,
    acceptStudyInviteService,
    denyStudyInviteService,
    startGroupStudyTimerService,
    pauseGroupStudyTimerService,
    stopGroupStudyTimerService,
    getGroupStudyLabListService,
    leaveGroupStudyService,
    kickGroupStudyMemberService,
    startSoloStudyTimerService,
    pauseSoloStudyTimerService,
    stopSoloStudyTimerService,
    getSoloStudyLabListService,
    getSoloStudyHistoryService,
    getYearlyStudyTimeService,
} from "@/app/services/study/service";
import type {
    StudyApiResponse,
    GroupStudyInfo,
    GroupStudyLeaveResult,
    GroupStudyKickResult,
    InviteStudyFriendRequest,
    StudyInvitationSentResult,
    StudyInvitationCancelResult,
    StudyInvitationAcceptResult,
    StudyInvitationRejectResult,
    GroupStudyTimerStartResult,
    GroupStudyTimerPauseResult,
    GroupStudyTimerEndResult,
    GroupStudyMemberLapsResult,
    SoloStudyTimerStartResult,
    SoloStudyTimerPauseResult,
    SoloStudyTimerEndResult,
    SoloStudyLapsResult,
    SoloStudyHistoryItem,
    DailyStudyTimeResult,
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
export const createGroupStudy = async (): Promise<StudyApiResponse<GroupStudyInfo>> => {
    try {
        return await createGroupStudyService();
    } catch (error) {
        return createStudyErrorResponse<GroupStudyInfo>(error, "그룹방 생성에 실패했습니다.");
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

// 솔로 세션 이력 조회
export const getSoloStudyHistory = async (): Promise<StudyApiResponse<SoloStudyHistoryItem[]>> => {
    try {
        return await getSoloStudyHistoryService();
    } catch (error) {
        return createStudyErrorResponse<SoloStudyHistoryItem[]>(error, "세션 이력 조회에 실패했습니다.");
    }
};

// 연간 누적 공부시간 조회 (잔디 히트맵용)
export const getYearlyStudyTime = async (): Promise<StudyApiResponse<DailyStudyTimeResult[]>> => {
    try {
        return await getYearlyStudyTimeService();
    } catch (error) {
        return createStudyErrorResponse<DailyStudyTimeResult[]>(error, "연간 학습 기록을 불러오지 못했습니다.");
    }
};
