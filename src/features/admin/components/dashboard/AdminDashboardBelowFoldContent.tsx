"use client";

import {
    Bell,
    CheckCircle2,
    ClipboardCheck,
    FileText,
    ShieldAlert,
} from "lucide-react";

import AdminDashboardAccessLogList from "./AdminDashboardAccessLogList";
import AdminDashboardCard from "./AdminDashboardCard";
import AdminDashboardMonthlyBarChart from "./AdminDashboardMonthlyBarChart";
import AdminDashboardNoticeList from "./AdminDashboardNoticeList";
import AdminDashboardReportList from "./AdminDashboardReportList";
import AdminDashboardSystemStatusList from "./AdminDashboardSystemStatusList";
import AdminDashboardTaskTable from "./AdminDashboardTaskTable";
import {
    AdminDashboardAccessLog,
    AdminDashboardMonthlyDatum,
    AdminDashboardNotice,
    AdminDashboardReport,
    AdminDashboardSystemStatus,
    AdminDashboardTask,
} from "./type";

interface AdminDashboardBelowFoldContentProps {
    monthlySubDashboardData: AdminDashboardMonthlyDatum[];
    pendingTasks: AdminDashboardTask[];
    notices: AdminDashboardNotice[];
    reports: AdminDashboardReport[];
    accessLogs: AdminDashboardAccessLog[];
    systemStatuses: AdminDashboardSystemStatus[];
}

export default function AdminDashboardBelowFoldContent({
    monthlySubDashboardData,
    pendingTasks,
    notices,
    reports,
    accessLogs,
    systemStatuses,
}: AdminDashboardBelowFoldContentProps) {
    return (
        <>
            <AdminDashboardMonthlyBarChart data={monthlySubDashboardData} />

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
        </>
    );
}
