import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import AdminReportList from "@/features/report/components/admin/AdminReportList";
import AdminReportManageNav from "@/features/report/components/admin/AdminReportManageNav";
import { AdminReportListItem } from "@/features/report/type";

interface AdminReportsPageProps {
    searchParams: Promise<{
        page?: string;
        status?: string;
    }>;
}

const REPORTS_PER_PAGE = 20;

const DUMMY_REPORTS: AdminReportListItem[] = [
    // TODO: 신고 목록 조회 API가 준비되면 최신순 목록 응답으로 교체한다.
    { id: 1, reason: "부적절한 내용", detail: "수강생을 비하하는 댓글이 반복해서 작성되었습니다.", reporterName: "김하늘", createdAt: "2026-06-20 16:42", isResolved: false },
    { id: 2, reason: "홍보성", detail: "외부 서비스 가입을 유도하는 링크가 포함되어 있습니다.", reporterName: "이민지", createdAt: "2026-06-20 15:18", isResolved: false },
    { id: 3, reason: "도배성", detail: "동일한 메시지가 채팅방에 여러 번 전송되었습니다.", reporterName: "박서준", createdAt: "2026-06-20 14:03", isResolved: true },
    { id: 4, reason: "기타", detail: "강의 소개 화면의 안내 문구가 실제 내용과 다릅니다.", reporterName: "최유진", createdAt: "2026-06-20 11:36", isResolved: true },
    // TODO: 페이지 신고 목록 응답에 관리자 확인 가능 여부가 포함되면 adminTargetPath 유무로 화면 분기를 대체한다.
    { id: 5, reason: "기타", detail: "마이페이지에서 불편한 동작을 확인했습니다.", reporterName: "정민우", createdAt: "2026-06-19 19:24", isResolved: false },
    { id: 6, reason: "홍보성", detail: "커뮤니티 게시글에 반복적인 광고 문구가 있습니다.", reporterName: "한지수", createdAt: "2026-06-19 17:50", isResolved: true },
    { id: 7, reason: "도배성", detail: "의미 없는 짧은 댓글을 연속으로 남기고 있습니다.", reporterName: "윤준호", createdAt: "2026-06-19 16:08", isResolved: false },
    { id: 8, reason: "부적절한 내용", detail: "강의 자료 공유 게시판에 부적절한 표현이 있습니다.", reporterName: "오민석", createdAt: "2026-06-19 13:27", isResolved: true },
    { id: 9, reason: "기타", detail: "메인 페이지의 잘못된 안내 문구를 신고했습니다.", reporterName: "이채은", createdAt: "2026-06-19 12:11", isResolved: true },
    { id: 10, reason: "부적절한 내용", detail: "다른 사용자를 조롱하는 채팅 메시지입니다.", reporterName: "강서연", createdAt: "2026-06-19 10:44", isResolved: false },
    { id: 11, reason: "홍보성", detail: "관련 없는 상품 구매 링크를 게시했습니다.", reporterName: "배지윤", createdAt: "2026-06-18 21:30", isResolved: true },
    { id: 12, reason: "도배성", detail: "수강평을 같은 내용으로 반복 등록했습니다.", reporterName: "김동현", createdAt: "2026-06-18 20:17", isResolved: false },
    { id: 13, reason: "부적절한 내용", detail: "강사에게 공격적인 표현을 사용한 댓글입니다.", reporterName: "임하영", createdAt: "2026-06-18 18:09", isResolved: true },
    { id: 14, reason: "기타", detail: "알림 설정 페이지의 오류를 신고했습니다.", reporterName: "유승민", createdAt: "2026-06-18 16:42", isResolved: false },
    { id: 15, reason: "홍보성", detail: "수강생 모집을 위한 외부 연락처를 남겼습니다.", reporterName: "서지훈", createdAt: "2026-06-18 15:31", isResolved: true },
    { id: 16, reason: "부적절한 내용", detail: "개인정보가 포함된 것으로 보이는 내용입니다.", reporterName: "문채원", createdAt: "2026-06-18 14:10", isResolved: false },
    { id: 17, reason: "도배성", detail: "채팅방에서 같은 이모티콘을 반복 전송했습니다.", reporterName: "송예린", createdAt: "2026-06-18 12:58", isResolved: true },
    { id: 18, reason: "기타", detail: "강의 소개 문구가 실제 내용과 다르다는 신고입니다.", reporterName: "박준형", createdAt: "2026-06-18 11:22", isResolved: false },
    { id: 19, reason: "부적절한 내용", detail: "다른 수강생에게 불쾌감을 주는 수강평입니다.", reporterName: "조하늘", createdAt: "2026-06-18 09:36", isResolved: true },
    { id: 20, reason: "홍보성", detail: "커뮤니티 댓글에 상업적 홍보 문구가 있습니다.", reporterName: "나현우", createdAt: "2026-06-17 20:14", isResolved: false },
    { id: 21, reason: "도배성", detail: "짧은 시간 동안 동일한 리뷰를 연속 등록했습니다.", reporterName: "김도윤", createdAt: "2026-06-17 18:45", isResolved: true },
    { id: 22, reason: "기타", detail: "내 강의 페이지의 안내 문구 개선을 요청했습니다.", reporterName: "장서윤", createdAt: "2026-06-17 17:20", isResolved: false },
    { id: 23, reason: "부적절한 내용", detail: "비방 목적의 채팅 메시지가 확인되었습니다.", reporterName: "남도현", createdAt: "2026-06-17 15:07", isResolved: true },
    { id: 24, reason: "홍보성", detail: "강의 후기와 무관한 외부 채널 홍보입니다.", reporterName: "신예은", createdAt: "2026-06-17 13:48", isResolved: false },
];

export default async function AdminReportsPage({
    searchParams,
}: AdminReportsPageProps) {
    const { page, status } = await searchParams;
    const currentView = status === "unread" ? "unread" : "all";
    const filteredReports = currentView === "unread"
        ? DUMMY_REPORTS.filter((report) => !report.isResolved)
        : DUMMY_REPORTS;
    const totalPages = Math.ceil(filteredReports.length / REPORTS_PER_PAGE);
    const requestedPage = Number(page) || 1;
    const currentPage = Math.min(Math.max(requestedPage, 1), Math.max(totalPages, 1));
    const visibleReports = filteredReports.slice(
        (currentPage - 1) * REPORTS_PER_PAGE,
        currentPage * REPORTS_PER_PAGE,
    );

    const createPageHref = (pageNumber: number) => {
        const params = new URLSearchParams();

        if (currentView === "unread") {
            params.set("status", "unread");
        }

        params.set("page", String(pageNumber));

        return `?${params.toString()}`;
    };

    return (
        <div className="mx-auto w-full max-w-360 pb-10">
            <div className="mb-8">
                <div className="flex items-center gap-3">
                    <div className="h-7 w-1.5 rounded-full bg-indigo-500" />
                    <h1 className="text-2xl font-bold text-slate-950">신고 관리</h1>
                </div>
                <p className="mt-3 text-sm font-medium text-slate-500">
                    접수된 신고를 확인하고 처리 상태를 관리합니다.
                </p>
            </div>

            <AdminReportManageNav currentView={currentView} />

            <AdminReportList reports={visibleReports} />

            {totalPages > 1 && (
                <Pagination className="mt-10">
                    <div className="relative">
                        <div className="relative mx-auto w-fit">
                            {currentPage > 1 && (
                                <PaginationPrevious
                                    href={createPageHref(currentPage - 1)}
                                    className="absolute right-full top-0 mr-1 w-fit"
                                />
                            )}

                            <PaginationContent>
                                {Array.from({ length: totalPages }, (_, index) => {
                                    const pageNumber = index + 1;

                                    return (
                                        <PaginationItem key={pageNumber}>
                                            <PaginationLink
                                                href={createPageHref(pageNumber)}
                                                isActive={currentPage === pageNumber}
                                            >
                                                {pageNumber}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}
                            </PaginationContent>

                            {currentPage < totalPages && (
                                <PaginationNext
                                    href={createPageHref(currentPage + 1)}
                                    className="absolute left-full top-0 ml-1 w-fit"
                                />
                            )}
                        </div>
                    </div>
                </Pagination>
            )}
        </div>
    );
}
