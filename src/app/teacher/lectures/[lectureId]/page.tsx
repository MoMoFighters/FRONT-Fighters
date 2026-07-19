import MovePageBackBtn from "@/components/common/MovePageBackBtn";
import LectureItem from "@/components/common/LectureItem";
import LectureDetailNav from "@/features/lecture/components/common/LectureDetailNav";
import LectureDetailList from "@/features/lecture/components/common/LectureDetailList";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    getLectureById,
    getReviewsByLectureId,
} from "@/app/services/lecture/service";
import { getVisiblePageNumbers } from "@/lib/pagination";

interface TeacherLectureDetailPageProps {
    params: Promise<{
        lectureId: string;
        category: string;
    }>;
    searchParams: Promise<{
        tab?: string;
        page?: string;
    }>;
}

export default async function TeacherLectureDetailPage({
    searchParams,
    params,
}: TeacherLectureDetailPageProps) {
    const { lectureId } = await params;
    const { tab, page } = await searchParams;
    const currentPage = Number(page) || 1;

    const [lecture, reviewResponseData] = await Promise.all([
        getLectureById(lectureId),
        tab === "reviews"
            ? getReviewsByLectureId(lectureId, currentPage)
            : Promise.resolve(undefined),
    ]);

    const pageNumbers = getVisiblePageNumbers(
        currentPage,
        reviewResponseData?.totalPages ?? 1,
    );

    if (!lecture) {
        return <div>존재하지 않는 강의입니다.</div>;
    }

    return (
        <div className="relative w-full p-12">
            <MovePageBackBtn href="/teacher/lectures/" />
            <LectureItem lecture={lecture} role="teacher" mode="detail" />

            <div className="relative mt-10 flex flex-col rounded-lg border border-slate-200 bg-white p-6">
                <LectureDetailNav href={`/teacher/lectures/${lectureId}`} />
                <div className="mb-4 border-t border-slate-400" />
                <LectureDetailList
                    role="teacher"
                    chapters={lecture.chapters}
                    reviews={reviewResponseData?.content ?? []}
                />
            </div>

            {tab === "reviews" && reviewResponseData && reviewResponseData.totalPages > 1 && (
                <Pagination className="mt-8">
                    <PaginationContent>
                        {currentPage > 1 && (
                            <PaginationItem>
                                <PaginationPrevious href={`?tab=reviews&page=${currentPage - 1}`} />
                            </PaginationItem>
                        )}

                        {pageNumbers.map((pageNumber) => (
                            <PaginationItem key={pageNumber}>
                                <PaginationLink
                                    href={`?tab=reviews&page=${pageNumber}`}
                                    isActive={currentPage === pageNumber}
                                >
                                    {pageNumber}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        {currentPage < reviewResponseData.totalPages && (
                            <PaginationItem>
                                <PaginationNext href={`?tab=reviews&page=${currentPage + 1}`} />
                            </PaginationItem>
                        )}
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}
