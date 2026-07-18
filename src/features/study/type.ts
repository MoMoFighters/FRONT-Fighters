import type { ApiResponse } from "@/lib/api";

// ====================
// 공통
// ====================

// 팀 스터디 API 공통 응답 형식 (다른 도메인 공용 ApiResponse와 필드는 같지만, status가 아니라 statusCode를 쓰고 data가 항상 옴)
export type StudyApiResponse<T> = Omit<ApiResponse<T>, "status" | "data"> & {
    statusCode: number;
    data: T;
};

// ====================
// Group Study
// ====================

// 그룹방 상태
export type StudyRoomStatus = 'ACTIVE' | 'ENDED';

// 그룹방 멤버 상태 / 멤버 타이머 상태
export type StudyRoomMemberStatus = 'INVITED' | 'JOINED' | 'LEFT' | 'REJECTED';
export type StudyRoomMemberTimerStatus = 'STUDYING' | 'RESTING' | null;

// 초대 상태
export type StudyInvitationStatus = 'INVITED' | 'CANCELED' | 'JOINED' | 'REJECTED';

// 그룹방 생성 요청 body
export interface CreateGroupStudyRequest {
    title: string;
}

// 그룹방 기본 정보 (그룹방 생성 응답에서 사용)
export interface GroupStudyInfo {
    roomId: number;
    hostUserId: number;
    hostNickname: string;
    title: string;
    status: StudyRoomStatus;
    maxMember: number;
}

// 그룹방 멤버 정보 (그룹방 상세 조회에서 사용, API 원본)
export interface GroupStudyRoomMember {
    userId: number;
    nickname: string;
    status: StudyRoomMemberStatus;
    timerStatus: StudyRoomMemberTimerStatus;
    // 이 방(group_room_member)에서 지금까지 누적한 공부 시간(초)
    totalSeconds: number;
}

// 그룹방 상세 정보 (그룹방 상세 조회 응답에서 사용)
export interface GroupStudyDetail extends GroupStudyInfo {
    title: string;
    members: GroupStudyRoomMember[];
}

// 그룹방 제목 수정 요청 body
export interface UpdateGroupStudyTitleRequest {
    title: string;
}

// 그룹방 제목 수정 응답
export interface UpdateGroupStudyTitleResult {
    roomId: number;
    title: string;
}

// 내가 속한 그룹방 목록 아이템
export interface MyGroupStudyRoomItem {
    roomId: number;
    hostUserId: number;
    hostNickname: string;
    title: string;
    memberCount: number;
    status: StudyRoomStatus;
    // 로그인 유저 본인의 이 방에서의 타이머 상태. null이면 켠 적 없거나 이미 종료함
    myTimerStatus: StudyRoomMemberTimerStatus;
}

// 그룹방 나가기 응답
export interface GroupStudyLeaveResult {
    roomId: number;
    status: 'LEFT';
    hostChanged: boolean;
    newHostId: number | null;
    roomEnded: boolean;
}

// 그룹방 멤버 내보내기 응답
export interface GroupStudyKickResult {
    roomId: number;
    targetUserId: number;
    status: 'KICKED';
}

// ====================
// Group Invite
// ====================

// 친구 초대 발송 body
export interface InviteStudyFriendRequest {
    inviteeId: number;
}

// 친구 초대 발송 응답
export interface StudyInvitationSentResult {
    invitationId: number;
    roomId: number;
    inviteeId: number;
    status: StudyInvitationStatus;
}

// 초대 취소 응답
export interface StudyInvitationCancelResult {
    invitationId: number;
    status: StudyInvitationStatus;
}

// 초대 수락 응답
export interface StudyInvitationAcceptResult {
    invitationId?: number;
    roomId: number;
    status: StudyInvitationStatus;
    joinedAt: string;
}

// 초대 거절 응답
export interface StudyInvitationRejectResult {
    invitationId?: number;
    roomId: number;
    status: StudyInvitationStatus;
}

// 내가 받은 초대 목록 아이템
export interface MyStudyInvitationItem {
    invitationId: number;
    roomId: number;
    hostUserId: number;
    hostNickname: string;
    title: string;
    invitedAt: string;
}

// 내가 방장으로서 보낸 초대 목록 아이템 (status=INVITED 인 것만)
export interface MySentStudyInvitationItem {
    invitationId: number;
    roomId: number;
    title: string;
    inviteeId: number;
    inviteeNickname: string;
    invitedAt: string;
}

// 내가 보낸 초대 목록 조회 응답
export interface MySentStudyInvitationListResult {
    invitations: MySentStudyInvitationItem[];
}

// ====================
// Group / Solo Timer 공통
// ====================

// 시작/재개 액션 구분
export type StudyTimerAction = 'STARTED' | 'RESUMED';

// 타이머 시작 가능 여부 조회 응답 (그룹방/솔로 세션 어느 화면에서 부르든 동일)
export interface TimerAvailabilityResult {
    canStartTimer: boolean;
}

// 랩 정보 (그룹/솔로 타이머 응답에서 공통으로 사용)
export interface StudyTimerLap {
    lapNumber: number;
    startedAt: string;
    endedAt: string | null;
    seconds: number | null;
}

// ====================
// Group Timer
// ====================

// 그룹 타이머 시작 응답
export interface GroupStudyTimerStartResult {
    roomId: number;
    memberId: number;
    action: StudyTimerAction;
    timerStatus: StudyRoomMemberTimerStatus;
    startedAt: string;
    accumulatedSeconds: number;
    lap: StudyTimerLap;
}

// 그룹 타이머 일시정지 응답
export interface GroupStudyTimerPauseResult {
    roomId: number;
    memberId: number;
    timerStatus: StudyRoomMemberTimerStatus;
    accumulatedSeconds: number;
    lap: StudyTimerLap;
}

// 그룹 타이머 종료 응답
export interface GroupStudyTimerEndResult {
    roomId: number;
    memberId: number;
    totalSeconds: number;
    lap: StudyTimerLap;
}

// ====================
// Group Statistics
// ====================

// 그룹방 멤버 랩 목록 조회 응답
export interface GroupStudyMemberLapsResult {
    targetUserId: number;
    laps: StudyTimerLap[];
}

// 랭킹 항목 (일별/월별 공통)
export interface StudyRankingEntry {
    rank: number;
    userId: number;
    nickname: string;
    totalSeconds: number;
}

// 그룹 멤버 일별 랭킹 조회 응답
export interface GroupStudyDailyRankingResult {
    type: 'daily';
    date: string;
    ranking: StudyRankingEntry[];
}

// 그룹 멤버 월별 랭킹 조회 응답
export interface GroupStudyMonthlyRankingResult {
    yearMonth: string;
    ranking: StudyRankingEntry[];
}

// ====================
// Solo Study
// ====================

// 솔로 세션 상태
export type SoloSessionStatus = 'RUNNING' | 'PAUSED' | 'ENDED';

// 개인 타이머 시작(최초 시작 또는 재개) 응답
export interface SoloStudyTimerStartResult {
    sessionId: number;
    action: StudyTimerAction;
    status: SoloSessionStatus;
    startTime: string;
    accumulatedSeconds: number;
    lap: StudyTimerLap;
}

// 개인 타이머 일시정지 응답
export interface SoloStudyTimerPauseResult {
    sessionId: number;
    status: SoloSessionStatus;
    accumulatedSeconds: number;
    lap: StudyTimerLap;
}

// 개인 타이머 종료 응답
export interface SoloStudyTimerEndResult {
    sessionId: number;
    status: SoloSessionStatus;
    totalSeconds: number;
    endTime: string;
    lap: StudyTimerLap;
}

// ====================
// Solo Statistics
// ====================

// 개인 랩 목록 조회 응답
export interface SoloStudyLapsResult {
    sessionId: number;
    laps: StudyTimerLap[];
}

// 현재 진행 중인 솔로 세션 조회 응답 (진행 중인 세션이 없으면 data가 null)
export interface SoloCurrentSessionResult {
    sessionId: number;
    status: SoloSessionStatus;
    startTime: string;
    accumulatedSeconds: number;
}

// 일별 누적 공부시간 조회 응답
export interface DailyStudyTimeResult {
    date: string;
    totalSeconds: number;
}

// 월별 누적 공부시간 조회 응답
export interface MonthlyStudyTimeResult {
    yearMonth: string;
    totalSeconds: number;
}

// ====================
// 화면 표시용 파생 타입
// (API 원본 타입을 조합해서 화면에서 쓰기 좋은 형태로 가공한 것들)
// ====================

// 스터디룸 좌석에 표시할 멤버 정보 (GroupStudyRoomMember + 방장/본인 여부)
export interface StudyRoomSeatUser extends GroupStudyRoomMember {
    isHost: boolean;
    isMe: boolean;
}
