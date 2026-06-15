import {
    Bell,
    BookOpen,
    CalendarDays,
    CheckCircle2,
    ClipboardCheck,
    FileText,
    LayoutDashboard,
    ShieldAlert,
    UserCheck,
    Users,
} from "lucide-react";

import AdminDashboardAccessLogList, {
    AdminDashboardAccessLog,
} from "@/features/admin/components/dashboard/AdminDashboardAccessLogList";
import AdminDashboardCard from "@/features/admin/components/dashboard/AdminDashboardCard";
import AdminDashboardMetricCard from "@/features/admin/components/dashboard/AdminDashboardMetricCard";
import AdminDashboardNoticeList, {
    AdminDashboardNotice,
} from "@/features/admin/components/dashboard/AdminDashboardNoticeList";
import AdminDashboardReportList, {
    AdminDashboardReport,
} from "@/features/admin/components/dashboard/AdminDashboardReportList";
import AdminDashboardSystemStatusList, {
    AdminDashboardSystemStatus,
} from "@/features/admin/components/dashboard/AdminDashboardSystemStatusList";
import AdminDashboardTaskTable, {
    AdminDashboardTask,
} from "@/features/admin/components/dashboard/AdminDashboardTaskTable";

export default function AdminDashboardPage() {
    // TODO: 추후 관리자 대시보드 집계 API로 교체 예정입니다.
    const metrics = [
        {
            title: "전체 회원",
            value: "12,458",
            previousLabel: "어제 대비",
            change: "320 (2.64%)",
            icon: Users,
            tone: "indigo" as const,
            changeTone: "indigo" as const,
        },
        {
            title: "승인 대기 강사",
            value: "18",
            previousLabel: "어제 대비",
            change: "5 (38.46%)",
            icon: UserCheck,
            tone: "amber" as const,
            changeTone: "amber" as const,
            badge: "대기",
        },
        {
            title: "활성 강의",
            value: "256",
            previousLabel: "어제 대비",
            change: "12 (4.92%)",
            icon: BookOpen,
            tone: "emerald" as const,
            changeTone: "emerald" as const,
        },
        {
            title: "미처리 신고",
            value: "27",
            previousLabel: "어제 대비",
            change: "7 (35.00%)",
            icon: ShieldAlert,
            tone: "rose" as const,
            changeTone: "rose" as const,
            badge: "긴급 3건",
        },
    ];

    // TODO: 승인/신고 요청을 최신순으로 5~6개만 조회하는 관리자 작업 큐 API로 교체 예정입니다.
    // 예: GET /api/v1/admin/dashboard/pending-tasks?size=5
    const pendingTasks: AdminDashboardTask[] = [
        {
            id: 1,
            type: "강사 승인",
            title: "김하나 강사 가입 승인 요청",
            requester: "김하나",
            requestedAt: "2026-06-14 14:32",
            status: "대기",
        },
        {
            id: 2,
            type: "강사 승인",
            title: "이준호 강사 가입 승인 요청",
            requester: "이준호",
            requestedAt: "2026-06-14 13:58",
            status: "대기",
        },
        {
            id: 3,
            type: "신고",
            title: "부적절한 강의 콘텐츠 신고",
            requester: "user_9281",
            requestedAt: "2026-06-14 13:10",
            status: "긴급",
        },
        {
            id: 4,
            type: "신고",
            title: "강사 부적절 언행 신고",
            requester: "user_7743",
            requestedAt: "2026-06-14 12:47",
            status: "대기",
        },
        {
            id: 5,
            type: "신고",
            title: "저작권 침해 의심 신고",
            requester: "user_5120",
            requestedAt: "2026-06-14 11:22",
            status: "대기",
        },
    ];

    // TODO: 공지사항 전체 조회 API 구현 후 최근 공지 데이터로 교체 예정입니다.
    const notices: AdminDashboardNotice[] = [
        {
            id: 1,
            title: "[안내] 시스템 정기 점검 안내 (6/15)",
            writer: "운영팀",
            date: "2026-06-14",
            pinned: true,
            isNew: true,
        },
        {
            id: 2,
            title: "[안내] 서비스 이용 약관 업데이트 안내",
            writer: "운영팀",
            date: "2026-06-12",
        },
        {
            id: 3,
            title: "[안내] MoMoCITY 커뮤니티 가이드 개정",
            writer: "운영팀",
            date: "2026-06-10",
        },
        {
            id: 4,
            title: "[안내] 강의 검수 기준 업데이트",
            writer: "운영팀",
            date: "2026-06-08",
        },
        {
            id: 5,
            title: "[안내] 신고 처리 정책 변경 안내",
            writer: "운영팀",
            date: "2026-06-05",
        },
        {
            id: 6,
            title: "[안내] 관리자 접근 로그 보관 정책 안내",
            writer: "운영팀",
            date: "2026-06-01",
        },
        {
            id: 7,
            title: "[안내] 강사 승인 심사 절차 변경 안내",
            writer: "운영팀",
            date: "2026-05-29",
        },
    ];

    // TODO: 신고 관리 API의 최근 신고 조회 응답으로 교체 예정입니다.
    const reports: AdminDashboardReport[] = [
        {
            id: 1,
            title: "강의 내 부적절한 표현",
            reporter: "user_9281",
            reportedAt: "2026-06-14 13:10",
            status: "긴급",
        },
        {
            id: 2,
            title: "강사 부적절 언행",
            reporter: "user_7743",
            reportedAt: "2026-06-14 12:47",
            status: "대기",
        },
        {
            id: 3,
            title: "저작권 침해 의심",
            reporter: "user_5120",
            reportedAt: "2026-06-14 11:22",
            status: "대기",
        },
    ];

    // TODO: 접근 로그 전체 조회 API 구현 후 최근 24시간 데이터로 교체 예정입니다.
    const accessLogs: AdminDashboardAccessLog[] = [
        {
            id: 1,
            country: "대한민국",
            ip: "211.234.56.78",
            account: "admin",
            accessedAt: "2026-06-14 14:21:32",
            status: "성공",
        },
        {
            id: 2,
            country: "대한민국",
            ip: "211.234.56.78",
            account: "admin",
            accessedAt: "2026-06-14 14:18:05",
            status: "성공",
        },
        {
            id: 3,
            country: "미국",
            ip: "93.184.216.34",
            account: "admin",
            accessedAt: "2026-06-14 13:02:11",
            status: "성공",
        },
        {
            id: 4,
            country: "대한민국",
            ip: "211.234.56.78",
            account: "admin",
            accessedAt: "2026-06-14 09:11:47",
            status: "성공",
        },
        {
            id: 5,
            country: "일본",
            ip: "150.95.120.15",
            account: "admin",
            accessedAt: "2026-06-14 08:43:23",
            status: "차단",
        },
    ];

    // TODO: 시스템 헬스 체크 API 구현 후 실시간 상태로 교체 예정입니다.
    const systemStatuses: AdminDashboardSystemStatus[] = [
        { id: 1, name: "웹 서비스", status: "정상" },
        { id: 2, name: "DB", status: "정상" },
        { id: 3, name: "파일 스토리지", status: "정상" },
        { id: 4, name: "메일 서비스", status: "정상" },
    ];

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
                    <div className="flex h-10 items-center gap-3 rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600">
                        <span>2026-06-14 (토)</span>
                        <CalendarDays className="h-4 w-4 text-slate-400" />
                    </div>

                    <div className="flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-black text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" />
                        시스템 정상
                    </div>
                </div>
            </div>

            <div className="mb-5 grid grid-cols-4 gap-4">
                {metrics.map((metric) => (
                    <AdminDashboardMetricCard
                        key={metric.title}
                        title={metric.title}
                        value={metric.value}
                        previousLabel={metric.previousLabel}
                        change={metric.change}
                        icon={metric.icon}
                        tone={metric.tone}
                        changeTone={metric.changeTone}
                        badge={metric.badge}
                    />
                ))}
            </div>

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
                        subtitle="(최근 24시간)"
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
