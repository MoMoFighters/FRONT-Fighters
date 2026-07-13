import { BookOpen, SearchX } from "lucide-react";

import { getLecturesWithAuth } from "@/app/services/lecture/service";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import AdminLectureList from "@/features/lecture/components/admin/AdminLectureList";
import LectureManageNav from "@/features/lecture/components/admin/LectureManageNav";
import AdminLectureSearchbar from "@/features/lecture/components/admin/AdminLectureSearchbar";
import { Category, LectureListRequest } from "@/features/lecture/type";
import { getVisiblePageNumbers } from "@/lib/pagination";

interface AdminLectureListPageProps {
    searchParams: Promise<{
        status?: string;
        category?: string;
        keyword?: string;
        page?: string;
    }>;
}

export default async function AdminLectureListPage({
    searchParams,
}: AdminLectureListPageProps) {
    const { status, keyword, category, page } = await searchParams;
    const currentPage = Number(page) || 1;
    const payload: LectureListRequest = {
        category: category?.toUpperCase() as Category | undefined,
        keyword,
        status,
        page: currentPage,
    };
    const responseData = await getLecturesWithAuth(payload);
    const totalPages = responseData.totalPages;
    const pageNumbers = getVisiblePageNumbers(currentPage, totalPages);

    const createPageHref = (pageNumber: number) => {
        const params = new URLSearchParams();

        if (status) params.set("status", status);
        if (category) params.set("category", category);
        if (keyword) params.set("keyword", keyword);
        params.set("page", String(pageNumber));

        return `?${params.toString()}`;
    };

    return (
        <div className="mx-auto w-full max-w-360 pb-10">
            <div className="mb-8">
                <div className="flex items-center gap-3">
                    <div className="h-7 w-1.5 rounded-full bg-indigo-500" />
                    <h1 className="text-2xl font-bold text-slate-950">강의 관리</h1>
                </div>
                <p className="mt-3 text-sm font-medium text-slate-500">
                    등록된 강의, 챕터 영상, 수강평을 조회하고 필요한 콘텐츠를 삭제합니다.
                </p>
            </div>

            <LectureManageNav />

            <AdminLectureSearchbar
                status={status}
                keyword={keyword}
                category={category}
            />

            <p className="mb-4 text-sm font-bold text-slate-500">
                {status && status === "waiting" ? "승인 대기" : "전체"} 강의 <span className="text-indigo-500">{responseData.totalElements}</span>개
            </p>

            {responseData.content.length > 0 ? (
                <>
                    <AdminLectureList
                        lectures={responseData.content}
                    />

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
                                        {pageNumbers.map((pageNumber) => (
                                            <PaginationItem key={pageNumber}>
                                                <PaginationLink
                                                    href={createPageHref(pageNumber)}
                                                    isActive={currentPage === pageNumber}
                                                >
                                                    {pageNumber}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}
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
                </>
            ) : (
                <div className="flex h-72 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-white text-slate-400">
                    {category ? <BookOpen className="size-12" /> : <SearchX className="size-12" />}
                    <p className="text-lg font-bold">찾으시는 강의가 존재하지 않습니다.</p>
                </div>
            )}
        </div>
    );
}
