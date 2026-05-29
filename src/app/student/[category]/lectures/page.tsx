import LectureItem from "@/components/common/LectureItem";

import LectureSearchbar from "@/features/lecture/components/common/LectureSearchbar";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

import {
    BookOpen,
    SearchX
} from "lucide-react";
import StudentLectureNav from "@/features/lecture/components/student/StudentLectureNav";
import MovePageBackBtn from "@/components/common/MovePageBackBtn";
import { getLectures } from "@/app/services/lecture/service";
import { GetLecturesRequest } from "@/features/lecture/type";

interface LectureListByCategoryProps {
    searchParams: Promise<{
        keyword?: string;
        filter?: string;
        page?: string;
    }>;

    params: Promise<{
        category: string;
    }>;
}

export default async function LectureListByCategory({
    searchParams,
    params
}: LectureListByCategoryProps) {

    const { category } =
        await params;

    const {
        keyword,
        filter,
        page
    } = await searchParams;

    const payload: GetLecturesRequest = {
        category: category.toUpperCase(),
        keyword,
        enrolled: filter === 'my',
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

        if (filter) {
            params.set(
                "filter",
                filter
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
            <StudentLectureNav
                category={category}
            />

            <div className="flex items-center gap-3 mb-4">

                <LectureSearchbar
                    keyword={keyword}
                    filter={filter}
                />

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
                                href={filter === "my"
                                    ? `/student/${category}/lectures/${lecture.id}?filter=my`
                                    : `/student/${category}/lectures/${lecture.id}`}
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
                        justify-center items-center
                        gap-5

                        text-2xl
                        text-slate-300
                        font-bold
                    "
                >

                    {filter === "my" ? (

                        <>
                            <BookOpen
                                className="
                                    w-12 h-12
                                    text-slate-300
                                "
                            />

                            <span className="text-center whitespace-pre-line">
                                아직 신청한 강의가 없습니다.
                            </span>
                        </>

                    ) : (

                        <>
                            <SearchX
                                className="
                                    w-12 h-12
                                    text-slate-300
                                "
                            />

                            <span className="text-center whitespace-pre-line">
                                찾으시는 강의가 존재하지 않습니다.
                            </span>
                        </>
                    )}

                </div>
            )}

        </div>
    );
}