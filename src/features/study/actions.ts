"use server";

import {
    createGroupStudyService,
    updateGroupStudyTitleService,
    getGroupStudyDetailService,
    inviteStudyFriendService,
    cancelStudyInviteService,
    acceptStudyInviteService,
    denyStudyInviteService,
    getSentStudyInviteListService,
    startGroupStudyTimerService,
    pauseGroupStudyTimerService,
    stopGroupStudyTimerService,
    getGroupStudyLabListService,
    leaveGroupStudyService,
    kickGroupStudyMemberService,
    getTimerAvailabilityService,
    startSoloStudyTimerService,
    pauseSoloStudyTimerService,
    stopSoloStudyTimerService,
    getSoloStudyLabListService,
    getYearlyStudyTimeService,
} from "@/app/services/study/service";
import type {
    StudyApiResponse,
    GroupStudyInfo,
    GroupStudyDetail,
    GroupStudyTitleUpdateResult,
    GroupStudyLeaveResult,
    GroupStudyKickResult,
    InviteStudyFriendRequest,
    StudyInvitationSentResult,
    StudyInvitationCancelResult,
    StudyInvitationAcceptResult,
    StudyInvitationRejectResult,
    SentStudyInvitationListResult,
    GroupStudyTimerStartResult,
    GroupStudyTimerPauseResult,
    GroupStudyTimerEndResult,
    GroupStudyMemberLapsResult,
    TimerAvailabilityResult,
    SoloStudyTimerStartResult,
    SoloStudyTimerPauseResult,
    SoloStudyTimerEndResult,
    SoloStudyLapsResult,
    YearlyStudyRecordResult,
} from "@/features/study/type";
import { revalidatePath } from "next/cache";

const createStudyErrorResponse = <T>(
    error: unknown,
    fallbackMessage: string
): StudyApiResponse<T> => {
    const raw = error instanceof Error ? error.message : "";
    const [statusPart, messagePart] = raw.split("|");
    const status = Number(statusPart);

    return {
        timestamp: new Date().toISOString(),
        status: Number.isFinite(status) ? status : 500,
        code: "STUDY-ACTION-FAILED",
        message: messagePart || fallbackMessage,
        data: null as T,
    };
};

// 그룹방 생성
export const createGroupStudy = async (
    title: string
): Promise<StudyApiResponse<GroupStudyInfo>> => {
    try {
        const response = await createGroupStudyService({ title });
        revalidatePath("/student/group-study");
        return response;
    } catch (error) {
        return createStudyErrorResponse<GroupStudyInfo>(error, "그룹방 생성에 실패했습니다.");
    }
};

// 그룹방 제목 수정
export const updateGroupStudyTitle = async (
    roomId: number,
    title: string
): Promise<StudyApiResponse<GroupStudyTitleUpdateResult>> => {
    try {
        const response = await updateGroupStudyTitleService(roomId, { title });
        revalidatePath(`/student/group-study/${roomId}`);
        return response;
    } catch (error) {
        return createStudyErrorResponse<GroupStudyTitleUpdateResult>(error, "방 제목 수정에 실패했습니다.");
    }
};

// 그룹방 상세 조회 (클라이언트 컴포넌트에서 실시간 이벤트 수신 후 재조회할 때 사용)
export const getGroupStudyDetail = async (
    roomId: number
): Promise<StudyApiResponse<GroupStudyDetail>> => {
    try {
        return await getGroupStudyDetailService(roomId);
    } catch (error) {
        return createStudyErrorResponse<GroupStudyDetail>(error, "그룹방 정보를 불러오지 못했습니다.");
    }
};

// 친구 초대 발송
export const inviteStudyFriend = async (
    roomId: number,
    body: InviteStudyFriendRequest
): Promise<StudyApiResponse<StudyInvitationSentResult>> => {
    try {
        const response = await inviteStudyFriendService(roomId, body);
        revalidatePath(`/student/group-study/${roomId}`);
        return response;
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
        const response = await cancelStudyInviteService(roomId, invitationId);
        revalidatePath(`/student/group-study/${roomId}`);
        return response;
    } catch (error) {
        return createStudyErrorResponse<StudyInvitationCancelResult>(error, "초대 취소에 실패했습니다.");
    }
};

// 초대 수락
export const acceptStudyInvite = async (
    roomId: number
): Promise<StudyApiResponse<StudyInvitationAcceptResult>> => {
    try {
        revalidatePath('/student/group-study')
        const response = await acceptStudyInviteService(roomId);
        revalidatePath(`/student/group-study/${roomId}`);
        return response;
    } catch (error) {
        return createStudyErrorResponse<StudyInvitationAcceptResult>(error, "초대 수락에 실패했습니다.");
    }
};

// 초대 거절
export const denyStudyInvite = async (
    roomId: number
): Promise<StudyApiResponse<StudyInvitationRejectResult>> => {
    try {
        const response = await denyStudyInviteService(roomId);
        revalidatePath("/student/group-study");
        return response;
    } catch (error) {
        return createStudyErrorResponse<StudyInvitationRejectResult>(error, "초대 거절에 실패했습니다.");
    }
};

// 내가 보낸 초대 목록 조회
export const getSentStudyInviteList = async (): Promise<StudyApiResponse<SentStudyInvitationListResult>> => {
    try {
        return await getSentStudyInviteListService();
    } catch (error) {
        return createStudyErrorResponse<SentStudyInvitationListResult>(error, "보낸 초대 목록 조회에 실패했습니다.");
    }
};

// 그룹방 타이머 시작
export const startGroupStudyTimer = async (
    roomId: number
): Promise<StudyApiResponse<GroupStudyTimerStartResult>> => {
    try {
        const response = await startGroupStudyTimerService(roomId);
        revalidatePath(`/student/group-study/${roomId}`);
        revalidatePath("/student/group-study");
        return response;
    } catch (error) {
        return createStudyErrorResponse<GroupStudyTimerStartResult>(error, "타이머 시작에 실패했습니다.");
    }
};

// 그룹방 타이머 일시정지
export const pauseGroupStudyTimer = async (
    roomId: number
): Promise<StudyApiResponse<GroupStudyTimerPauseResult>> => {
    try {
        const response = await pauseGroupStudyTimerService(roomId);
        revalidatePath(`/student/group-study/${roomId}`);
        revalidatePath("/student/group-study");
        return response;
    } catch (error) {
        return createStudyErrorResponse<GroupStudyTimerPauseResult>(error, "타이머 일시정지에 실패했습니다.");
    }
};

// 그룹방 타이머 종료
export const stopGroupStudyTimer = async (
    roomId: number
): Promise<StudyApiResponse<GroupStudyTimerEndResult>> => {
    try {
        const response = await stopGroupStudyTimerService(roomId);
        revalidatePath(`/student/group-study/${roomId}`);
        revalidatePath("/student/group-study");
        return response;
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
        const response = await leaveGroupStudyService(roomId);
        revalidatePath(`/student/group-study/${roomId}`);
        revalidatePath("/student/group-study");
        return response;
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
        const response = await kickGroupStudyMemberService(roomId, targetUserId);
        revalidatePath(`/student/group-study/${roomId}`);
        return response;
    } catch (error) {
        return createStudyErrorResponse<GroupStudyKickResult>(error, "멤버 내보내기에 실패했습니다.");
    }
};

// 개인 타이머 시작
export const startSoloStudyTimer = async (): Promise<StudyApiResponse<SoloStudyTimerStartResult>> => {
    try {
        const response = await startSoloStudyTimerService();
        revalidatePath("/student/group-study/solo");
        revalidatePath("/student/group-study");
        return response;
    } catch (error) {
        return createStudyErrorResponse<SoloStudyTimerStartResult>(error, "솔로 타이머 시작에 실패했습니다.");
    }
};

// 개인 타이머 일시정지
export const pauseSoloStudyTimer = async (): Promise<StudyApiResponse<SoloStudyTimerPauseResult>> => {
    try {
        const response = await pauseSoloStudyTimerService();
        revalidatePath("/student/group-study/solo");
        revalidatePath("/student/group-study");
        return response;
    } catch (error) {
        return createStudyErrorResponse<SoloStudyTimerPauseResult>(error, "솔로 타이머 일시정지에 실패했습니다.");
    }
};

// 개인 타이머 종료
export const stopSoloStudyTimer = async (): Promise<StudyApiResponse<SoloStudyTimerEndResult>> => {
    try {
        const response = await stopSoloStudyTimerService();
        revalidatePath("/student/group-study/solo");
        revalidatePath("/student/group-study");
        return response;
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

// 솔로 세션 이력 조회 - 제거함 (service.ts 주석 참고: 백엔드에 매핑된 엔드포인트가 없음)

// 타이머 시작 가능 여부 조회
export const getTimerAvailability = async (): Promise<StudyApiResponse<TimerAvailabilityResult>> => {
    try {
        return await getTimerAvailabilityService();
    } catch (error) {
        return createStudyErrorResponse<TimerAvailabilityResult>(error, "타이머 시작 가능 여부 조회에 실패했습니다.");
    }
};

// 연간 누적 공부시간 조회 (잔디 히트맵용)
export const getYearlyStudyTime = async (): Promise<StudyApiResponse<YearlyStudyRecordResult>> => {
    try {
        return await getYearlyStudyTimeService();
    } catch (error) {
        return createStudyErrorResponse<YearlyStudyRecordResult>(error, "연간 학습 기록을 불러오지 못했습니다.");
    }
};
