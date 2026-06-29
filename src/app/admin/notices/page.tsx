import Link from "next/link";
import { Plus } from "lucide-react";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { getNotices } from "@/app/services/notice/service";
import AdminNoticeList from "@/features/notice/components/admin/AdminNoticeList";

interface AdminNoticesPageProps {
    searchParams: Promise<{ page?: string }>;
}

export default async function AdminNoticesPage({
    searchParams,
}: AdminNoticesPageProps) {
    const { page } = await searchParams;
    const requestedPage = Number(page) || 1;
    const noticeResponse = await getNotices(requestedPage);
    const totalPages = noticeResponse.totalPages;
    const currentPage = noticeResponse.page || requestedPage;
    const notices = noticeResponse.items;

    return (
        <div className="mx-auto w-full max-w-360 pb-10">
            <div className="mb-8 flex items-start justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="h-7 w-1.5 rounded-full bg-indigo-500" />
                        <h1 className="text-2xl font-bold text-slate-950">공지사항</h1>
                    </div>
                    <p className="mt-3 text-sm font-medium text-slate-500">
                        서비스 운영과 관련된 공지사항을 등록하고 관리합니다.
                    </p>
                </div>
                <Button asChild className="h-10 rounded-md bg-indigo-500 px-4 text-sm font-bold text-white hover:bg-indigo-600">
                    <Link href="/admin/notices/regist">
                        <Plus className="size-4" />
                        공지 등록
                    </Link>
                </Button>
            </div>

            <p className="mb-4 text-sm font-semibold text-slate-500">
                전체 공지사항 <span className="text-indigo-500">{noticeResponse.totalElements}</span>개
            </p>

            <AdminNoticeList notices={notices} />

            {totalPages > 1 && (
                <Pagination className="mt-10">
                    <div className="relative">
                        <div className="relative mx-auto w-fit">
                            {currentPage > 1 && (
                                <PaginationPrevious href={`?page=${currentPage - 1}`} className="absolute right-full top-0 mr-1 w-fit" />
                            )}
                            <PaginationContent>
                                {Array.from({ length: totalPages }, (_, index) => {
                                    const pageNumber = index + 1;

                                    return (
                                        <PaginationItem key={pageNumber}>
                                            <PaginationLink href={`?page=${pageNumber}`} isActive={pageNumber === currentPage}>
                                                {pageNumber}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}
                            </PaginationContent>
                            {currentPage < totalPages && (
                                <PaginationNext href={`?page=${currentPage + 1}`} className="absolute left-full top-0 ml-1 w-fit" />
                            )}
                        </div>
                    </div>
                </Pagination>
            )}
        </div>
    );
}
