import AdminPageHeader from "@/features/admin/components/AdminPageHeader";
import AdminAccessLogList from "@/features/admin/access-log/components/AdminAccessLogList";
import { getAccessLogs } from "@/app/services/access-log/service";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { getVisiblePageNumbers } from "@/lib/pagination";

interface AdminAccessLogsPageProps {
    searchParams: Promise<{ page?: string }>;
}

export default async function AdminAccessLogsPage({
    searchParams,
}: AdminAccessLogsPageProps) {
    const { page } = await searchParams;
    const requestedPage = Number(page) || 1;
    const accessLogResponse = await getAccessLogs(requestedPage);
    const totalPages = accessLogResponse.totalPages;
    const currentPage = accessLogResponse.page || requestedPage;
    const logs = accessLogResponse.items;
    const pageNumbers = getVisiblePageNumbers(currentPage, totalPages);

    return (
        <div className="mx-auto w-full max-w-360 pb-10">
            <AdminPageHeader
                title="접근 로그"
                description="서비스 접근 기록을 최근순으로 확인합니다."
            />

            <p className="mb-4 text-sm font-bold text-slate-500">
                전체 접근 기록 <span className="text-indigo-500">{accessLogResponse.totalElements}</span>건
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
                                {pageNumbers.map((pageNumber) => (
                                    <PaginationItem key={pageNumber}>
                                        <PaginationLink
                                            href={`?page=${pageNumber}`}
                                            isActive={pageNumber === currentPage}
                                        >
                                            {pageNumber}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
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
