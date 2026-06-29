import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { getReportList } from "@/app/services/report/service";
import AdminReportList from "@/features/report/components/admin/AdminReportList";
import AdminReportManageNav from "@/features/report/components/admin/AdminReportManageNav";
import {
    AdminReportListItem,
    ReportList,
} from "@/features/report/type";

interface AdminReportsPageProps {
    searchParams: Promise<{
        page?: string;
        status?: string;
    }>;
}

const REPORTS_PER_PAGE = 10;

const mapReportListItem = (report: ReportList): AdminReportListItem => ({
    id: report.reportId,
    reason: report.reason,
    detail: report.detail,
    reporterName: report.reporterName,
    createdAt: report.reportedAt ?? report.createdAt ?? "",
    isResolved: report.isResolved,
    targetType: report.targetType,
    targetId: report.targetId,
});

export default async function AdminReportsPage({
    searchParams,
}: AdminReportsPageProps) {
    const { page, status } = await searchParams;
    const currentView = status === "unread" ? "unread" : "all";
    const requestedPage = Math.max(Number(page) || 1, 1);

    const reportResponse = await getReportList({
        page: requestedPage,
        size: REPORTS_PER_PAGE,
        isResolved: currentView === "unread" ? false : undefined,
    });

    const reports = reportResponse.items.map(mapReportListItem);
    const currentPage = reportResponse.page;
    const totalPages = reportResponse.totalPages;

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

            <AdminReportList reports={reports} />

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
