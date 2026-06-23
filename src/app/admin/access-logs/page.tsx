import AdminPageHeader from "@/features/admin/components/AdminPageHeader";
import { DUMMY_ACCESS_LOGS } from "@/features/admin/access-log/constants/dummyAccessLogs";
import AdminAccessLogList from "@/features/admin/access-log/components/AdminAccessLogList";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface AdminAccessLogsPageProps {
    searchParams: Promise<{ page?: string }>;
}

const ACCESS_LOGS_PER_PAGE = 20;

export default async function AdminAccessLogsPage({
    searchParams,
}: AdminAccessLogsPageProps) {
    const { page } = await searchParams;
    const totalPages = Math.ceil(DUMMY_ACCESS_LOGS.length / ACCESS_LOGS_PER_PAGE);
    const requestedPage = Number(page) || 1;
    const currentPage = Math.min(Math.max(requestedPage, 1), totalPages);
    const logs = DUMMY_ACCESS_LOGS.slice(
        (currentPage - 1) * ACCESS_LOGS_PER_PAGE,
        currentPage * ACCESS_LOGS_PER_PAGE,
    );

    return (
        <div className="mx-auto w-full max-w-360 pb-10">
            <AdminPageHeader
                title="접근 로그"
                description="서비스 접근 기록을 최근순으로 확인합니다."
            />

            <p className="mb-4 text-sm font-semibold text-slate-500">
                전체 접근 기록 <span className="text-indigo-500">{DUMMY_ACCESS_LOGS.length}</span>건
            </p>

            <AdminAccessLogList logs={logs} />

            {totalPages > 1 && (
                <Pagination className="mt-10">
                    <div className="relative">
                        <div className="relative mx-auto w-fit">
                            {currentPage > 1 && (
                                <PaginationPrevious
                                    href={`?page=${currentPage - 1}`}
                                    className="absolute right-full top-0 mr-1 w-fit"
                                />
                            )}

                            <PaginationContent>
                                {Array.from({ length: totalPages }, (_, index) => {
                                    const pageNumber = index + 1;

                                    return (
                                        <PaginationItem key={pageNumber}>
                                            <PaginationLink
                                                href={`?page=${pageNumber}`}
                                                isActive={pageNumber === currentPage}
                                            >
                                                {pageNumber}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}
                            </PaginationContent>

                            {currentPage < totalPages && (
                                <PaginationNext
                                    href={`?page=${currentPage + 1}`}
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
