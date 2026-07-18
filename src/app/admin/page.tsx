import {
    BookOpen,
    CheckCircle2,
    LayoutDashboard,
    ShieldAlert,
    UserCheck,
    Users,
    Wallet,
} from "lucide-react";

import AdminDashboardBelowFoldDynamic from "@/features/admin/components/dashboard/AdminDashboardBelowFoldDynamic";
import AdminDashboardDynamic from "@/features/admin/components/dashboard/AdminDashboardDynamic";
import AdminDashboardMetricCard from "@/features/admin/components/dashboard/AdminDashboardMetricCard";
import {
    getDashboardSummary,
    getMonthlyMemberships,
    getMonthlyPayments,
    getMonthlyState,
    getMonthlySubState,
    getTotalPayments,
} from "@/app/services/admin-dashboard/service";
import {
    AdminDashboardAccessLog,
    AdminDashboardMonthlyDatum,
    AdminDashboardMonthlyRevenueDatum,
    AdminDashboardNotice,
    AdminDashboardReport,
    AdminDashboardSystemStatus,
    AdminDashboardTask,
    DashboardRecentAccessLogs,
    DashboardSummaryResponse,
    DashboardSystemHealth,
    MonthlyCount,
    MonthlyStateResponse,
    TotalPaymentsResponse,
} from "@/features/admin/components/dashboard/type";
import { USER_ROLE_LABEL } from "@/features/user/type";

const formatAdminDateTime = (dateTime: string) => {
    return dateTime.replace("T", " ").slice(0, 16);
};

const createMonthlyCountMap = (counts: MonthlyCount[]) => {
    return new Map(counts.map((item) => [item.month, item.count]));
};

const formatAccessUser = (log: DashboardRecentAccessLogs) => {
    if (!log.userName || !log.role) {
        return "외부 접근";
    }

    return `${log.userName}(${USER_ROLE_LABEL[log.role]})`;
};

// 웹 서비스 상태는 백엔드 값이 아니라, 대시보드 렌더링에 쓰인 API 호출들이 실제로 전부 성공했는지로 판단합니다.
const mapSystemHealth = (systemHealth: DashboardSystemHealth, isWebServiceHealthy: boolean): AdminDashboardSystemStatus[] => [
    { id: 1, name: "웹 서비스", status: isWebServiceHealthy ? "정상" : "비정상" },
    { id: 2, name: "DB", status: systemHealth.database },
    { id: 3, name: "파일 스토리지", status: systemHealth.fileStorage },
    { id: 4, name: "메일 서비스", status: systemHealth.mailService },
];

const EMPTY_MONTHLY_STATE: MonthlyStateResponse = {
    memberCounts: [],
    lectureCounts: [],
    postCounts: [],
};

const EMPTY_DASHBOARD_SUMMARY: DashboardSummaryResponse = {
    cards: { totalUsers: 0, unresolvedReports: 0, pendingTeachers: 0, activeLectures: 0 },
    pendingTasks: [],
    recentReports: [],
    recentNotices: [],
    recentAccessLogs: [],
    systemHealth: { webService: "정상", database: "비정상", fileStorage: "비정상", mailService: "비정상" },
};

const EMPTY_TOTAL_PAYMENTS: TotalPaymentsResponse = { totalSales: 0 };

interface AdminDashboardPageProps {
    searchParams: Promise<{
        year?: string;
    }>;
}

export default async function AdminDashboardPage({
    searchParams,
}: AdminDashboardPageProps) {
    const { year } = await searchParams;
    const dashboardYear = Number(year) || new Date().getFullYear();

    // Promise.allSettled: 병렬 호출은 유지하면서, 하나가 실패해도 나머지 결과를 기다려 개별 성공/실패를 판단합니다.
    const [
        monthlyStateResult,
        monthlySubStateResult,
        dashboardSummaryResult,
        totalPaymentsResult,
        monthlyPaymentsResult,
        monthlyMembershipsResult,
    ] = await Promise.allSettled([
        getMonthlyState(dashboardYear),
        getMonthlySubState(),
        getDashboardSummary(),
        getTotalPayments(),
        getMonthlyPayments(),
        getMonthlyMemberships(),
    ]);

    const monthlyState = monthlyStateResult.status === "fulfilled" ? monthlyStateResult.value : EMPTY_MONTHLY_STATE;
    const monthlySubState = monthlySubStateResult.status === "fulfilled" ? monthlySubStateResult.value : EMPTY_MONTHLY_STATE;
    const dashboardSummary = dashboardSummaryResult.status === "fulfilled" ? dashboardSummaryResult.value : EMPTY_DASHBOARD_SUMMARY;
    const totalPayments = totalPaymentsResult.status === "fulfilled" ? totalPaymentsResult.value : EMPTY_TOTAL_PAYMENTS;
    const monthlyPayments = monthlyPaymentsResult.status === "fulfilled" ? monthlyPaymentsResult.value : [];
    const monthlyMemberships = monthlyMembershipsResult.status === "fulfilled" ? monthlyMembershipsResult.value : [];

    const isWebServiceHealthy = [
        monthlyStateResult,
        monthlySubStateResult,
        dashboardSummaryResult,
        totalPaymentsResult,
        monthlyPaymentsResult,
        monthlyMembershipsResult,
    ].every((result) => result.status === "fulfilled");

    const memberCountMap = createMonthlyCountMap(monthlyState.memberCounts);
    const lectureCountMap = createMonthlyCountMap(monthlyState.lectureCounts);
    const postCountMap = createMonthlyCountMap(monthlyState.postCounts);
    const monthlyDashboardData: AdminDashboardMonthlyDatum[] = [
        ...Array.from({ length: 12 }, (_, index) => {
            const month = index + 1;

            return {
                month: `${month}월`,
                totalLectures: lectureCountMap.get(month) ?? null,
                totalUsers: memberCountMap.get(month) ?? null,
                totalPosts: postCountMap.get(month) ?? null,
            };
        }),
    ];
    const subMemberCountMap = createMonthlyCountMap(monthlySubState.memberCounts);
    const subLectureCountMap = createMonthlyCountMap(monthlySubState.lectureCounts);
    const subPostCountMap = createMonthlyCountMap(monthlySubState.postCounts);
    const monthlySubDashboardData: AdminDashboardMonthlyDatum[] = [
        ...Array.from({ length: 12 }, (_, index) => {
            const month = index + 1;

            return {
                month: `${month}월`,
                totalLectures: subLectureCountMap.get(month) ?? null,
                totalUsers: subMemberCountMap.get(month) ?? null,
                totalPosts: subPostCountMap.get(month) ?? null,
            };
        }),
    ];

    const monthlyPaymentsMap = new Map(monthlyPayments.map((item) => [item.month, item.sales]));
    const monthlyMembershipsMap = new Map(monthlyMemberships.map((item) => [item.month, item]));
    const monthlyRevenueData: AdminDashboardMonthlyRevenueDatum[] = Array.from({ length: 12 }, (_, index) => {
        const month = index + 1;
        const membership = monthlyMembershipsMap.get(month);

        return {
            month: `${month}월`,
            sales: monthlyPaymentsMap.get(month) ?? null,
            basic: membership?.basic ?? null,
            plus: membership?.plus ?? null,
            pro: membership?.pro ?? null,
        };
    });

    const pendingTasks: AdminDashboardTask[] = dashboardSummary.pendingTasks.map((task, index) => ({
        id: index + 1,
        type: task.type === "TEACHER" ? "강사 승인" : "신고",
        title: task.title,
        requester: task.requester,
        requestedAt: formatAdminDateTime(task.requestedAt),
        status: "대기",
    }));

    const notices: AdminDashboardNotice[] = dashboardSummary.recentNotices.map((notice) => ({
        id: notice.noticeId,
        title: notice.title,
        date: formatAdminDateTime(notice.createdAt),
        pinned: notice.isPinned,
    }));

    const reports: AdminDashboardReport[] = dashboardSummary.recentReports.map((report) => ({
        id: report.reportId,
        title: report.reason,
        reporter: report.reporterName,
        reportedAt: formatAdminDateTime(report.createdAt),
        status: report.isResolved ? "처리" : "미처리",
    }));

    const accessLogs: AdminDashboardAccessLog[] = dashboardSummary.recentAccessLogs.map((log) => ({
        id: log.logId,
        ip: log.ip,
        user: formatAccessUser(log),
        accessedAt: formatAdminDateTime(log.accessedAt),
        status: log.isSuccess ? "성공" : "실패",
    }));

    const systemStatuses = mapSystemHealth(dashboardSummary.systemHealth, isWebServiceHealthy);
    const isSystemHealthy = systemStatuses.every((status) => status.status === "정상");

    return (
        <div className="pb-10">
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <LayoutDashboard className="h-5 w-5 text-indigo-500" />
                        <h1 className="text-2xl font-black text-slate-950">
                            대시보드
                        </h1>
                    </div>

                    <p className="mt-2 text-sm font-bold text-slate-500">
                        MoMoCITY 운영 현황을 한눈에 확인하세요.
                    </p>
                </div>

                <div className="flex items-center gap-3">

                    <div className={`flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-black ${isSystemHealthy ? "text-emerald-600" : "text-rose-500"}`}>
                        <CheckCircle2 className="h-4 w-4" />
                        {isSystemHealthy ? "시스템 정상" : "시스템 확인 필요"}
                    </div>
                </div>
            </div>

            <div className="mb-5 grid grid-cols-5 gap-4">
                <AdminDashboardMetricCard
                    title="총 회원 수"
                    value={`${dashboardSummary.cards.totalUsers.toLocaleString()}명`}
                    icon={Users}
                    tone="indigo"
                    description="현재 가입된 전체 회원 수"
                />

                <AdminDashboardMetricCard
                    title="총 강의 수"
                    value={`${dashboardSummary.cards.activeLectures.toLocaleString()}개`}
                    icon={BookOpen}
                    tone="emerald"
                    description="현재 운영 중인 강의 수"
                />

                <AdminDashboardMetricCard
                    title="대기 중인 신고"
                    value={`${dashboardSummary.cards.unresolvedReports.toLocaleString()}건`}
                    icon={ShieldAlert}
                    tone="rose"
                    description="아직 처리되지 않은 신고 수"
                />

                <AdminDashboardMetricCard
                    title="승인 대기 중인 강사"
                    value={`${dashboardSummary.cards.pendingTeachers.toLocaleString()}명`}
                    icon={UserCheck}
                    tone="amber"
                    description="승인 검토가 필요한 강사 수"
                />

                <AdminDashboardMetricCard
                    title="총 매출"
                    value={`₩${totalPayments.totalSales.toLocaleString()}`}
                    icon={Wallet}
                    tone="violet"
                    description="누적 결제 매출 합계"
                />
            </div>

            <AdminDashboardDynamic
                data={monthlyDashboardData}
                year={dashboardYear}
            />

            <AdminDashboardBelowFoldDynamic
                monthlySubDashboardData={monthlySubDashboardData}
                monthlyRevenueData={monthlyRevenueData}
                pendingTasks={pendingTasks}
                notices={notices}
                reports={reports}
                accessLogs={accessLogs}
                systemStatuses={systemStatuses}
            />

        </div>
    );
}
