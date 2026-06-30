import {
    Bell,
    CheckCircle2,
    ClipboardCheck,
    FileText,
    LayoutDashboard,
    ShieldAlert,
} from "lucide-react";

import AdminDashboardAccessLogList from "@/features/admin/components/dashboard/AdminDashboardAccessLogList";
import AdminDashboardCard from "@/features/admin/components/dashboard/AdminDashboardCard";
import AdminDashboardNoticeList from "@/features/admin/components/dashboard/AdminDashboardNoticeList";
import AdminDashboardReportList from "@/features/admin/components/dashboard/AdminDashboardReportList";
import AdminDashboardSystemStatusList from "@/features/admin/components/dashboard/AdminDashboardSystemStatusList";
import AdminDashboardTaskTable from "@/features/admin/components/dashboard/AdminDashboardTaskTable";
import { getDashboardSummary, getMonthlyState } from "@/app/services/admin-dashboard/service";
import {
    AdminDashboardAccessLog,
    AdminDashboardMonthlyDatum,
    AdminDashboardNotice,
    AdminDashboardReport,
    AdminDashboardSystemStatus,
    AdminDashboardTask,
    DashboardRecentAccessLogs,
    DashboardSystemHealth,
    MonthlyCount,
} from "@/features/admin/components/dashboard/type";
import { USER_ROLE_LABEL } from "@/features/user/type";
import AdminDashboardDynamic from "@/features/admin/components/dashboard/AdminDashboardDynamic";

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

const mapSystemHealth = (systemHealth: DashboardSystemHealth): AdminDashboardSystemStatus[] => [
    { id: 1, name: "웹 서비스", status: systemHealth.webService },
    { id: 2, name: "DB", status: systemHealth.database },
    { id: 3, name: "파일 스토리지", status: systemHealth.fileStorage },
    { id: 4, name: "메일 서비스", status: systemHealth.mailService },
];

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

    const [monthlyState, dashboardSummary] = await Promise.all([
        getMonthlyState(dashboardYear),
        getDashboardSummary(),
    ]);

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

    const systemStatuses = mapSystemHealth(dashboardSummary.systemHealth);
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

                    <p className="mt-2 text-sm font-semibold text-slate-500">
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

            <AdminDashboardDynamic
                data={monthlyDashboardData}
                year={dashboardYear}
            />

            <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(440px,0.96fr)] gap-5">
                <div className="space-y-5">
                    <AdminDashboardCard
                        title="처리 대기 작업"
                        icon={ClipboardCheck}
                    >
                        <AdminDashboardTaskTable tasks={pendingTasks} />
                    </AdminDashboardCard>

                    <AdminDashboardCard
                        title="공지사항"
                        href="/admin/notices"
                        icon={Bell}
                    >
                        <AdminDashboardNoticeList notices={notices} />
                    </AdminDashboardCard>
                </div>

                <div className="space-y-5">
                    <AdminDashboardCard
                        title="최근 신고"
                        href="/admin/reports"
                        icon={ShieldAlert}
                    >
                        <AdminDashboardReportList reports={reports} />
                    </AdminDashboardCard>

                    <AdminDashboardCard
                        title="접근 로그"
                        href="/admin/access-logs"
                        icon={FileText}
                    >
                        <AdminDashboardAccessLogList logs={accessLogs} />
                    </AdminDashboardCard>

                    <AdminDashboardCard
                        title="시스템 상태"
                        icon={CheckCircle2}
                    >
                        <AdminDashboardSystemStatusList statuses={systemStatuses} />
                    </AdminDashboardCard>
                </div>
            </div>
        </div>
    );
}
