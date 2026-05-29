import LectureItem from "@/components/common/LectureItem";

import LectureManageNav from "@/features/lecture/components/admin/LectureManageNav";
import LectureFilterBtn from "@/features/lecture/components/buttons/LectureFilterBtn";
import LectureSearchbar from "@/features/lecture/components/common/LectureSearchbar";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

import { SearchX } from "lucide-react";
import { GetLecturesRequest } from "@/features/lecture/type";
import { getLectures } from "@/app/services/lecture/service";

interface AdminLectureListPageProps {
    searchParams: Promise<{
        status?: string;
        category?: string;
        keyword?: string;
        page?: string;
    }>
}

export default async function AdminLectureListPage({
    searchParams
}: AdminLectureListPageProps) {

    const {
        status,
        keyword,
        category,
        page
    } = await searchParams;

    const payload: GetLecturesRequest = {
        category: category?.toUpperCase(),
        keyword,
        status,
        page: Number(page) || 1,
    };

    const responseData = await getLectures(payload);

    const totalPages = responseData.totalPages;

    const currentPage = Number(page) || 1;

    const createPageHref = (
        pageNumber: number
    ) => {

        const params =
            new URLSearchParams();

        if (status) {
            params.set(
                "status",
                status
            );
        }

        if (category) {
            params.set(
                "category",
                category
            );
        }

        if (keyword) {
            params.set(
                "keyword",
                keyword
            );
        }

        params.set(
            "page",
            String(pageNumber)
        );

        return `?${params.toString()}`;
    };

    return (
        <div>

            <div className="flex items-center gap-3 mb-10">

                <div className="w-2 h-7 bg-slate-500 rounded-full" />

                <h2 className="text-2xl font-bold text-slate-900">
                    강의 관리
                </h2>

            </div>

            <LectureManageNav />

            <div className="flex items-center gap-3 mb-4">

                <LectureSearchbar
                    status={status}
                    keyword={keyword}
                    category={category}
                />

                <LectureFilterBtn />

            </div>

            <div className="border-t border-slate-400 mb-4" />

            {responseData.content.length > 0 ? (

                <>
                    <div className="space-y-3">

                        {responseData.content.map((lecture) => (

                            <LectureItem
                                key={lecture.id}
                                lecture={lecture}
                                role="admin"
                                mode="list"
                                href={`/admin/lectures/${lecture.id}`}
                            />
                        ))}

                    </div>

                    {totalPages > 1 && (

                        <Pagination className="mt-10">

                            <PaginationContent>

                                {currentPage > 1 && (
                                    <PaginationItem>

                                        <PaginationPrevious
                                            href={createPageHref(
                                                currentPage - 1
                                            )}
                                        />

                                    </PaginationItem>
                                )}

                                {Array.from(
                                    { length: totalPages },
                                    (_, index) => {

                                        const pageNumber =
                                            index + 1;

                                        return (
                                            <PaginationItem
                                                key={pageNumber}
                                            >

                                                <PaginationLink
                                                    href={createPageHref(
                                                        pageNumber
                                                    )}
                                                    isActive={
                                                        currentPage ===
                                                        pageNumber
                                                    }
                                                >
                                                    {pageNumber}
                                                </PaginationLink>

                                            </PaginationItem>
                                        );
                                    }
                                )}

                                {currentPage < totalPages && (
                                    <PaginationItem>

                                        <PaginationNext
                                            href={createPageHref(
                                                currentPage + 1
                                            )}
                                        />

                                    </PaginationItem>
                                )}

                            </PaginationContent>

                        </Pagination>
                    )}
                </>

            ) : (

                <div
                    className="
                        h-60
                        flex flex-col
                        gap-5
                        justify-center
                        items-center

                        text-2xl
                        text-slate-300
                        font-bold
                    "
                >

                    <SearchX
                        className="
                            w-12 h-12
                            text-slate-300
                        "
                    />

                    <span>
                        찾으시는 강의가 존재하지 않습니다.
                    </span>

                </div>
            )}

        </div>
    );
}