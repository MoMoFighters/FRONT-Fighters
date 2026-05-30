import LectureItem from "@/components/common/LectureItem";

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
import MovePageBackBtn from "@/components/common/MovePageBackBtn";
import { CategoryApiUrl, CategoryUrl, GetLecturesRequest } from "@/features/lecture/type";
import { getLectures } from "@/app/services/lecture/service";

const CATEGORY_MAP: Record<
    CategoryUrl,
    CategoryApiUrl
> = {
    study: "STUDY",
    fitness: "FITNESS",
    cook: "COOK",
    beauty: "BEAUTY",
    art: "ART",
};

interface LectureListPageProps {
    searchParams: Promise<{
        category?: CategoryUrl;
        keyword?: string;
        page?: string;
    }>
}

export default async function LectureListPage({
    searchParams
}: LectureListPageProps) {

    const {
        keyword,
        category,
        page
    } = await searchParams;

    const payload: GetLecturesRequest = {
        category: category
            ? CATEGORY_MAP[category]
            : undefined,
        keyword,
        enrolled: false,
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

        if (keyword) {
            params.set(
                "keyword",
                keyword
            );
        }

        if (category) {
            params.set(
                "category",
                category
            );
        }

        params.set(
            "page",
            String(pageNumber)
        );

        return `?${params.toString()}`;
    };

    return (
        <div className="p-12 relative">
            <MovePageBackBtn href="/student" />

            <div className="flex items-center gap-3 mb-4">

                <LectureSearchbar
                    category={category}
                    keyword={keyword}
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
                                role="student"
                                mode="list"
                                href={`/student/lectures/${lecture.id}`}
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
                        items-center justify-center
                        gap-5

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