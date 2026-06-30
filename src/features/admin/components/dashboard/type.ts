import { UserRole } from "@/features/user/type";

// 월 별 추이 데이터 응답값 타입 정의
export interface MonthlyCount {
    month: number;
    count: number;
}

// 월 별 차트 데이터 조회 타입 정의
export interface MonthlyStateResponse {
    memberCounts: MonthlyCount[];
    lectureCounts: MonthlyCount[];
    postCounts: MonthlyCount[];
}

// 대시보드 월별 차트 화면 데이터 타입 정의
export interface AdminDashboardMonthlyDatum {
    month: string;
    totalLectures: number | null;
    totalUsers: number | null;
    totalPosts: number | null;
}

// 대시보드 카드 값 타입 정의 -> 카드 미사용으로 추후에 api에서도 없어질 값이지만 현재 api에 맞게 정의
export interface DashboardCard {
    totalUsers: number;
    unresolvedReports: number;
    pendingTeachers: number;
    activeLectures: number;
}

// 대시보드 처리 대기 작업 타입 정의
export interface DashboardPendingTasks {
    type: "REPORT" | "TEACHER";
    title: string;
    requester: string;
    requestedAt: string;
}

// 대시보드 처리 대기 작업 화면 데이터 타입 정의
export interface AdminDashboardTask {
    id: number;
    type: "강사 승인" | "신고";
    title: string;
    requester: string;
    requestedAt: string;
    status: "대기" | "긴급";
}

// 대시보드 최근 신고 타입 정의
export interface DashboardRecentReports {
    reportId: number;
    reporterName: string;
    reason: string;
    isResolved: boolean;
    createdAt: string;
}

// 대시보드 최근 신고 화면 데이터 타입 정의
export interface AdminDashboardReport {
    id: number;
    title: string;
    reporter: string;
    reportedAt: string;
    status: "처리" | "미처리";
}

// 대시보드 최근 공지사항 타입 정의
export interface DashboardRecentNotices {
    noticeId: number;
    title: string;
    createdAt: string;
    isPinned: boolean;
}

// 대시보드 최근 공지사항 화면 데이터 타입 정의
export interface AdminDashboardNotice {
    id: number;
    title: string;
    date: string;
    pinned: boolean;
}

// 대시보드 최근 접근 로그 타입 정의
export interface DashboardRecentAccessLogs {
    logId: number;
    ip: string;
    userName: string | null;
    role: UserRole | null;
    isSuccess: boolean;
    accessedAt: string;
}

// 대시보드 접근 로그 화면 데이터 타입 정의
export interface AdminDashboardAccessLog {
    id: number;
    ip: string;
    user: string;
    accessedAt: string;
    status: "성공" | "실패";
}

// 대시보드 시스템 상태 타입 정의
export interface DashboardSystemHealth {
    webService: "정상" | "비정상";
    database: "정상" | "비정상";
    fileStorage: "정상" | "비정상";
    mailService: "정상" | "비정상";
}

// 대시보드 시스템 상태 화면 데이터 타입 정의
export interface AdminDashboardSystemStatus {
    id: number;
    name: string;
    status: "정상" | "비정상";
}

// 대시보드 통계 조회 타입 정의
export interface DashboardSummaryResponse {
    cards: DashboardCard;
    pendingTasks: DashboardPendingTasks[];
    recentReports: DashboardRecentReports[];
    recentNotices: DashboardRecentNotices[];
    recentAccessLogs: DashboardRecentAccessLogs[];
    systemHealth: DashboardSystemHealth;
}
