import { Review } from "@/app/admin/lectures/[lectureId]/page";
import { getChaptersById, getLectureById, getLectureProgress } from "@/app/services/lecture/service";
import LectureItem from "@/components/common/LectureItem";
import MovePageBackBtn from "@/components/common/MovePageBackBtn";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import LectureDetailList from "@/features/lecture/components/common/LectureDetailList";
import LectureDetailNav from "@/features/lecture/components/common/LectureDetailNav";
import { notFound } from "next/navigation";

interface LectureByCategoryDetailProps {
    params: Promise<{
        lectureId: string;
        category: string;
    }>
    searchParams: Promise<{
        filter?: string;
        tab?: string;
        page?: string;
    }>
}

export default async function LectureByCategoryDetail({ searchParams, params }: LectureByCategoryDetailProps) {

    const { category, lectureId } = await params;
    const { tab, page } = await searchParams;

    const dummyReviews: Review[] = [
        { id: 1, name: '홍길동', rating: 5, content: '정말 유익한 강의였습니다! 매일 아침 따라하고 있어요.', createdAt: '2024.05.15' },
        { id: 2, name: '김철수', rating: 4, content: '설명이 쉽고 자세해서 좋았습니다. 추천합니다!', createdAt: '2024.05.14' },
        { id: 3, name: '이영희', rating: 5, content: '운동 초보자도 쉽게 따라할 수 있어요.', createdAt: '2024.05.13' },
        { id: 4, name: '박민수', rating: 4, content: '체계적인 커리큘럼이 마음에 듭니다.', createdAt: '2024.05.12' },
        { id: 5, name: '최수진', rating: 5, content: '강사님이 친절하고 설명이 명확해요.', createdAt: '2024.05.11' },
        { id: 6, name: '정대호', rating: 3, content: '괜찮은 강의입니다. 다만 난이도가 조금 낮은 편.', createdAt: '2024.05.10' },
    ];

    const lecture = await getLectureById(lectureId);

    if (!lecture) {
        notFound();
    }

    const progressData = lecture.isEnrolled
        ? await getLectureProgress(lectureId)
        : undefined;

    const chaptersData = lecture.isEnrolled
        ? await getChaptersById(lectureId)
        : [];

    const chapters = lecture.isEnrolled
        ? lecture.chapters.map((chapter) => {
            const progress = chaptersData.find(
                (item) => item.chapterId === chapter.chapterId
            );

            return {
                ...chapter,
                videoUrl:
                    "https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4",
                progressRate: progress?.progressRate ?? 0,
                watchedSeconds: progress?.watchedSeconds ?? 0,
                isCompleted: progress?.isCompleted ?? false,
                isAccessible: progress?.isAccessible ?? false,
            };
        })
        : lecture.chapters;

    // module 4 이후 - 수강평 기능 중 페이지네이션
    const currentPage = Number(page ?? 1);
    const REVIEWS_PER_PAGE = 5;
    const totalPages = Math.ceil(
        dummyReviews.length / REVIEWS_PER_PAGE
    );
    const paginatedReviews = dummyReviews.slice(
        (currentPage - 1) * REVIEWS_PER_PAGE,
        currentPage * REVIEWS_PER_PAGE
    );

    return (
        <div className="p-12 relative">
            <MovePageBackBtn href={`/student/${category}/lectures`} />
            <LectureItem progressData={progressData} lecture={lecture} role="student" mode="detail" />
            <div className="mt-10 bg-white flex flex-col border rounded-lg border-slate-200 p-6 relative">
                <LectureDetailNav href={`/student/${category}/lectures/${lectureId}`} />
                <div className="border-t border-slate-400 mb-4" />
                <LectureDetailList role="student" isEnrolled={lecture.isEnrolled} chapters={chapters} reviews={paginatedReviews} />
            </div>
            {tab === "reviews" && (
                <Pagination className="mt-8">
                    <PaginationContent>

                        {currentPage > 1 && (
                            <PaginationItem>
                                <PaginationPrevious
                                    href={`?tab=reviews&page=${currentPage - 1}`}
                                />
                            </PaginationItem>
                        )}

                        {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                        ).map((pageNumber) => (

                            <PaginationItem key={pageNumber}>
                                <PaginationLink
                                    href={`?tab=reviews&page=${pageNumber}`}
                                    isActive={currentPage === pageNumber}
                                >
                                    {pageNumber}
                                </PaginationLink>
                            </PaginationItem>

                        ))}

                        {currentPage < totalPages && (
                            <PaginationItem>
                                <PaginationNext
                                    href={`?tab=reviews&page=${currentPage + 1}`}
                                />
                            </PaginationItem>
                        )}

                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}