import { notFound } from "next/navigation";

import {
    getLectureById,
} from "@/app/services/lecture/service";
import ListPagination from "@/components/common/ListPagination";
import BuildGuideCard from "@/features/lecture/components/student/shared/BuildGuideCard";
import CategoryPreviewCard from "@/features/lecture/components/student/shared/CategoryPreviewCard";
import getCategoryMeta from "@/features/lecture/components/student/shared/category";
import StudentChapterList from "@/features/lecture/components/student/detail/StudentChapterList";
import StudentLectureDetailItem from "@/features/lecture/components/student/detail/StudentLectureDetailItem";
import StudentLectureDetailTabs from "@/features/lecture/components/student/detail/StudentLectureDetailTabs";
import StudentReviewList, {
    StudentReview,
} from "@/features/lecture/components/student/detail/StudentReviewList";
import StudentPageHeader from "@/features/student/components/StudentPageHeader";

interface LectureDetailPageProps {
    params: Promise<{
        lectureId: string;
    }>;
    searchParams: Promise<{
        page?: string;
        tab?: string;
        position?: string;
    }>;
}

const DUMMY_REVIEWS: StudentReview[] = [
    {
        id: 1,
        name: "모모시티러버",
        rating: 5,
        content: "설명이 자세하고 따라가기 쉬웠어요. 꾸준히 듣기 좋은 강의입니다.",
        createdAt: "2026.06.10",
    },
    {
        id: 2,
        name: "학습러",
        rating: 4,
        content: "챕터 구성이 깔끔해서 흐름을 놓치지 않고 볼 수 있었습니다.",
        createdAt: "2026.06.09",
    },
    {
        id: 3,
        name: "민수",
        rating: 5,
        content: "초보자도 부담 없이 시작할 수 있는 난이도라 만족합니다.",
        createdAt: "2026.06.08",
    },
    {
        id: 4,
        name: "성장중",
        rating: 4,
        content: "실습 예시가 조금 더 많으면 더 좋을 것 같아요.",
        createdAt: "2026.06.07",
    },
    {
        id: 5,
        name: "도시건설자",
        rating: 5,
        content: "강의를 들으면서 건물이 성장하는 느낌이 좋아요.",
        createdAt: "2026.06.06",
    },
    {
        id: 6,
        name: "꾸준함",
        rating: 4,
        content: "짧은 챕터 단위라 매일 듣기 편합니다.",
        createdAt: "2026.06.05",
    },
];

export default async function LectureDetailPage({
    params,
    searchParams,
}: LectureDetailPageProps) {
    const { lectureId } = await params;
    const { tab, page, position } = await searchParams;

    const lecture = await getLectureById(lectureId);

    if (!lecture) {
        notFound();
    }

    const categoryMeta = getCategoryMeta(lecture.category);
    const category = lecture.category.toLowerCase();

    const chapters = lecture.chapters;

    const currentTab = tab === "reviews"
        ? "reviews"
        : "chapters";
    const currentPage = Number(page) || 1;
    const reviewsPerPage = 5;
    const totalReviewPages = Math.ceil(
        DUMMY_REVIEWS.length / reviewsPerPage
    );
    const paginatedReviews = DUMMY_REVIEWS.slice(
        (currentPage - 1) * reviewsPerPage,
        currentPage * reviewsPerPage
    );

    const createReviewPageHref = (pageNumber: number) => {
        const params = new URLSearchParams();

        if (position) {
            params.set("position", position);
        }

        params.set("tab", "reviews");
        params.set("page", String(pageNumber));

        return `?${params.toString()}`;
    };

    const lectureListHref = position
        ? `/student/lectures?position=${position}`
        : "/student/lectures";

    const lectureDetailHref = position
        ? `/student/lectures/${lectureId}?position=${position}`
        : `/student/lectures/${lectureId}`;

    const firstChapter = chapters.find((chapter) => chapter.orderNo === 1);
    const resumeChapter = chapters.find((chapter) => (
        chapter.isAccessible !== false &&
        !chapter.isCompleted
    )) ?? firstChapter;

    return (
        <main className="mx-auto grid w-full max-w-360 grid-cols-[minmax(0,1fr)_320px] gap-8 px-12 py-12">
            <section className="min-w-0">
                <StudentPageHeader
                    backHref={lectureListHref}
                    breadcrumbs={[
                        {
                            label: "홈",
                            href: "/student",
                        },
                        {
                            label: "강의 둘러보기",
                            href: lectureListHref,
                        },
                        {
                            label: lecture.title,
                        },
                    ]}
                    title={lecture.title}
                />

                <StudentLectureDetailItem
                    lecture={lecture}
                    category={category}
                    categoryLabel={categoryMeta.label}
                    resumeChapterId={resumeChapter?.chapterId}
                />

                <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <StudentLectureDetailTabs
                        href={lectureDetailHref}
                        currentTab={currentTab}
                        reviewCount={DUMMY_REVIEWS.length}
                    />

                    {currentTab === "chapters" ? (
                        <StudentChapterList
                            category={category}
                            lectureId={lectureId}
                            chapters={chapters}
                            isEnrolled={lecture.isEnrolled}
                        />
                    ) : (
                        <>
                            <StudentReviewList reviews={paginatedReviews} />

                            <div className="border-t border-slate-100 px-5 pb-5">
                                <ListPagination
                                    currentPage={currentPage}
                                    totalPages={totalReviewPages}
                                    createHref={createReviewPageHref}
                                />
                            </div>
                        </>
                    )}
                </section>
            </section>

            <aside className="sticky mt-4 top-10 self-start space-y-5">
                <BuildGuideCard />
                <CategoryPreviewCard />
            </aside>
        </main>
    );
}
