// ====================
// 공통
// ====================

// 팀 스터디 API 공통 응답 형식
// 백엔드 ApiResponse<T> 레코드 필드명 그대로 맞춤 (status, 과거 statusCode 아님)
export interface StudyApiResponse<T> {
    timestamp: string;
    status: number;
    code: string;
    message: string;
    data: T;
}

// ====================
// Group Study
// ====================

// 그룹방 상태
export type StudyRoomStatus = 'ACTIVE' | 'ENDED';

// 그룹방 멤버 상태 (GroupRoomMember.MemberStatus 전체 값)
export type StudyRoomMemberStatus =
    | 'INVITED'
    | 'JOINED'
    | 'LEFT'
    | 'KICKED'
    | 'REJECTED'
    | 'CANCELED';
// 멤버 타이머 상태
// 'NONE'은 완전 종료 상태. STOMP 이벤트는 이 값을 문자열로 내려주고(과거엔 null이었음),
// REST 상세 조회 응답은 지금도 null을 내려줄 수 있어 둘 다 허용한다.
export type StudyRoomMemberTimerStatus = 'STUDYING' | 'RESTING' | 'NONE' | null;

// 초대 상태
export type StudyInvitationStatus = 'INVITED' | 'CANCELED' | 'JOINED' | 'REJECTED';

// 그룹방 기본 정보 (그룹방 생성 응답에서 사용)
export interface GroupStudyInfo {
    roomId: number;
    hostUserId: number;
    hostNickname: string;
    title: string;
    status: StudyRoomStatus;
    maxMember: number;
}

// 그룹방 생성 요청 body
export interface CreateGroupStudyRequest {
    title: string;
}

// 그룹방 제목 수정 요청 body
export interface UpdateGroupStudyTitleRequest {
    title: string;
}

// 그룹방 제목 수정 응답
export interface GroupStudyTitleUpdateResult {
    roomId: number;
    title: string;
}

// 그룹방 멤버 정보 (그룹방 상세 조회에서 사용, API 원본)
// GroupRoomDetailResponse.MemberItem 기준 - status=JOINED인 현재 참가자만 내려온다
export interface GroupStudyRoomMember {
    userId: number;
    nickname: string;
    profileImageUrl: string | null;
    status: StudyRoomMemberStatus;
    timerStatus: StudyRoomMemberTimerStatus;
    totalSeconds: number;
}

// 그룹방 상세 정보 (그룹방 상세 조회 응답에서 사용)
export interface GroupStudyDetail extends GroupStudyInfo {
    members: GroupStudyRoomMember[];
}

// 내가 속한 그룹방 목록 아이템
export interface MyGroupStudyRoomItem {
    roomId: number;
    hostUserId: number;
    hostNickname: string;
    title: string;
    memberCount: number;
    status: StudyRoomStatus;
    myTimerStatus: StudyRoomMemberTimerStatus;
}

// 내가 속한 그룹방 목록 조회 응답 (GroupRoomListResponse - rooms로 감싸서 내려옴, 배열 아님)
export interface MyGroupStudyRoomListResult {
    rooms: MyGroupStudyRoomItem[];
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
    title: string;
    hostUserId: number;
    hostNickname: string;
    invitedAt: string;
}

// 내가 받은 초대 목록 조회 응답 (InvitationListResponse - invitations로 감싸서 내려옴, 배열 아님)
export interface MyStudyInvitationListResult {
    invitations: MyStudyInvitationItem[];
}

// 내가 보낸 초대 목록 아이템 (GET /api/v3/study/members/invitations/sent - 기존 프론트에 없던 엔드포인트)
export interface SentStudyInvitationItem {
    invitationId: number;
    roomId: number;
    title: string;
    inviteeId: number;
    inviteeNickname: string;
    inviteeProfileImageUrl: string | null;
    invitedAt: string;
}

// 내가 보낸 초대 목록 조회 응답 (SentInvitationListResponse - invitations로 감싸서 내려옴, 배열 아님)
export interface SentStudyInvitationListResult {
    invitations: SentStudyInvitationItem[];
}

// ====================
// Group / Solo Timer 공통
// ====================

// 시작/재개 액션 구분
export type StudyTimerAction = 'STARTED' | 'RESUMED';

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
// 타이머 시작 가능 여부 (GET /api/v3/study/timer-availability - 기존 프론트에 없던 엔드포인트)
// ====================

export interface TimerAvailabilityResult {
    canStartTimer: boolean;
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
    profileImageUrl: string | null;
    totalSeconds: number;
}

// 그룹 멤버 랭킹 조회 응답 (일별/월별 공용 - 백엔드가 RankingResponse 하나로 통일해서 내려줌)
// period: daily 조회 시 "2026-07-13", monthly 조회 시 "2026-07"
export interface StudyRankingResult {
    period: string;
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

// 솔로 세션 이력 아이템
// ⚠️ 백엔드에 GET /api/v3/study/solo/history 컨트롤러 엔드포인트가 아직 없음
// (SoloSessionRepository/SoloSessionJpaRepository에 "용도" 주석만 있고 실제 매핑 없음) - 호출 시 404 발생. 백엔드 확인 필요.
export interface SoloStudyHistoryItem {
    sessionId: number;
    startTime: string;
    endTime: string;
    totalSeconds: number;
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

// 연간 잔디 조회 응답 (GET /api/v3/study/records/yearly - 기존 프론트에 없던 엔드포인트)
export interface YearlyStudyRecordDay {
    date: string;
    totalSeconds: number;
}

export interface YearlyStudyRecordResult {
    records: YearlyStudyRecordDay[];
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

// ====================
// Group Study 실시간(STOMP) 이벤트
// 구독 destination: /sub/study/room/{roomId}
// 실제 페이로드는 StudyBroadcastEventHandler.java 기준으로 맞춤:
// 모든 이벤트가 { type, roomId, data } 한 포맷으로 오고, data는 이벤트별로 필드가 다른 Map.
// 대부분 필드가 id값뿐이라(닉네임 등 상세정보 없음), 수신 시 방 상세를 다시 조회해서 갱신하는 방식을 권장.
// ====================

export type StudyRoomSocketEventType =
    | 'MEMBER_JOINED'
    | 'MEMBER_LEFT'
    | 'MEMBER_KICKED'
    | 'HOST_CHANGED'
    | 'ROOM_ENDED'
    | 'TIMER_STATUS_CHANGED';

export interface StudyRoomMemberJoinedData {
    userId: number;
}

export interface StudyRoomMemberLeftData {
    userId: number;
}

export interface StudyRoomMemberKickedData {
    targetUserId: number;
    hostUserId: number;
}

export interface StudyRoomHostChangedData {
    newHostUserId: number;
}

// ROOM_ENDED는 data가 빈 객체({})로 온다.
export type StudyRoomEndedData = Record<string, never>;

export interface StudyRoomTimerStatusChangedData {
    userId: number;
    // 백엔드가 null 대신 문자열 "NONE"으로 내려준다 (Map.of가 null value를 허용 안 해서).
    timerStatus: 'STUDYING' | 'RESTING' | 'NONE';
    // 진행 중인 랩의 시작 시각. STUDYING일 때만 값이 있고 RESTING/NONE이면 항상 null.
    startedAt: string | null;
    // 이 값을 기준으로 카운트업 계산 (startedAt이 있으면 거기서부터 경과분을 더함).
    accumulatedSeconds: number;
}

// 화면에서 멤버별 카운트업을 계산하기 위한 타이머 상태 (REST 응답과 STOMP 이벤트를 같은 모양으로 맞춘 파생 타입)
export interface StudyMemberTimerMeta {
    timerStatus: StudyRoomMemberTimerStatus;
    startedAt: string | null;
    accumulatedSeconds: number;
}

export interface StudyRoomSocketEvent {
    type: StudyRoomSocketEventType;
    roomId: number;
    data:
    | StudyRoomMemberJoinedData
    | StudyRoomMemberLeftData
    | StudyRoomMemberKickedData
    | StudyRoomHostChangedData
    | StudyRoomEndedData
    | StudyRoomTimerStatusChangedData;
}
