import {
    Bell,
    CheckCircle2,
    ClipboardCheck,
    FileText,
    LayoutDashboard,
    ShieldAlert,
} from "lucide-react";

import AdminDashboardAccessLogList, {
    AdminDashboardAccessLog,
} from "@/features/admin/components/dashboard/AdminDashboardAccessLogList";
import AdminDashboardCard from "@/features/admin/components/dashboard/AdminDashboardCard";
import AdminDashboardMonthlyLineChart, {
    AdminDashboardMonthlyDatum,
} from "@/features/admin/components/dashboard/AdminDashboardMonthlyLineChart";
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
    // TODO: 추후 관리자 대시보드 월별 집계 API 응답으로 교체 예정입니다.
    const dashboardYear = 2026;

    const monthlyDashboardData: AdminDashboardMonthlyDatum[] = [
        {
            month: "1월",
            totalLectures: 82,
            totalUsers: 8320,
            totalPosts: 1240,
        },
        {
            month: "2월",
            totalLectures: 104,
            totalUsers: 8940,
            totalPosts: 1510,
        },
        {
            month: "3월",
            totalLectures: 127,
            totalUsers: 9560,
            totalPosts: 1785,
        },
        {
            month: "4월",
            totalLectures: 151,
            totalUsers: 10180,
            totalPosts: 2045,
        },
        {
            month: "5월",
            totalLectures: 188,
            totalUsers: 10960,
            totalPosts: 2380,
        },
        {
            month: "6월",
            totalLectures: 216,
            totalUsers: 11720,
            totalPosts: 2670,
        },
        {
            month: "7월",
            totalLectures: 232,
            totalUsers: 12080,
            totalPosts: 2810,
        },
        {
            month: "8월",
            totalLectures: 248,
            totalUsers: 12340,
            totalPosts: 2950,
        },
        {
            month: "9월",
            totalLectures: 265,
            totalUsers: 12890,
            totalPosts: 3180,
        },
        {
            month: "10월",
            totalLectures: 284,
            totalUsers: 13420,
            totalPosts: 3420,
        },
        {
            month: "11월",
            totalLectures: 306,
            totalUsers: 13940,
            totalPosts: 3665,
        },
        {
            month: "12월",
            totalLectures: 328,
            totalUsers: 14580,
            totalPosts: 3920,
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
            status: "처리",
        },
        {
            id: 2,
            title: "강사 부적절 언행",
            reporter: "user_7743",
            reportedAt: "2026-06-14 12:47",
            status: "미처리",
        },
        {
            id: 3,
            title: "저작권 침해 의심",
            reporter: "user_5120",
            reportedAt: "2026-06-14 11:22",
            status: "미처리",
        },
    ];

    // TODO: 접근 로그 전체 조회 API 구현 후 최근 24시간 데이터로 교체 예정입니다.
    const accessLogs: AdminDashboardAccessLog[] = [
        {
            id: 1,
            ip: "211.234.56.78",
            account: "admin",
            accessedAt: "2026-06-14 14:21:32",
            status: "성공",
        },
        {
            id: 2,
            ip: "211.234.56.78",
            account: "admin",
            accessedAt: "2026-06-14 14:18:05",
            status: "성공",
        },
        {
            id: 3,
            ip: "93.184.216.34",
            account: "admin",
            accessedAt: "2026-06-14 13:02:11",
            status: "성공",
        },
        {
            id: 4,
            ip: "211.234.56.78",
            account: "admin",
            accessedAt: "2026-06-14 09:11:47",
            status: "성공",
        },
        {
            id: 5,
            ip: "150.95.120.15",
            account: "admin",
            accessedAt: "2026-06-14 08:43:23",
            status: "실패",
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

                    <div className="flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-black text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" />
                        시스템 정상
                    </div>
                </div>
            </div>

            <AdminDashboardMonthlyLineChart
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
