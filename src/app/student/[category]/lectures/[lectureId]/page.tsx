import { notFound } from "next/navigation";

import {
    getLectureById,
    getLatestChapterInfo,
    getProgressByCategory,
    getReviewsByLectureId,
} from "@/app/services/lecture/service";
import ListPagination from "@/components/common/ListPagination";
import CreateReviewBtn from "@/features/lecture/components/buttons/CreateReviewBtn";
import ReviewSummaryButton from "@/features/lecture/components/buttons/ReviewSummaryButton";
import StudentChapterList from "@/features/lecture/components/student/detail/StudentChapterList";
import StudentLectureDetailItem from "@/features/lecture/components/student/detail/StudentLectureDetailItem";
import StudentLectureDetailTabs from "@/features/lecture/components/student/detail/StudentLectureDetailTabs";
import StudentReviewList from "@/features/lecture/components/student/detail/StudentReviewList";
import CategoryBuildingCard from "@/features/lecture/components/student/shared/CategoryBuildingCard";
import getCategoryMeta from "@/features/lecture/components/student/shared/category";
import LearningProgressCard from "@/features/lecture/components/student/shared/LearningProgressCard";
import ResumeLectureCard from "@/features/lecture/components/student/shared/ResumeLectureCard";
import { generateLectureDetailMetadata } from "@/features/lecture/metadata";
import { Category } from "@/features/lecture/type";
import StudentPageHeader from "@/features/student/components/StudentPageHeader";

interface LectureByCategoryDetailProps {
    params: Promise<{
        lectureId: string;
        category: string;
    }>;
    searchParams: Promise<{
        tab?: string;
        page?: string;
    }>;
}

export const generateMetadata = async ({
    params,
}: LectureByCategoryDetailProps) => {
    const { category, lectureId } = await params;

    return generateLectureDetailMetadata({
        lectureId,
        pathname: `/student/${category}/lectures/${lectureId}`,
    });
};

export default async function LectureByCategoryDetail({
    searchParams,
    params,
}: LectureByCategoryDetailProps) {
    const { category, lectureId } = await params;
    const { tab, page } = await searchParams;

    const categoryApiValue = category.toUpperCase() as Category;
    const categoryMeta = getCategoryMeta(categoryApiValue);
    const currentTab = tab === "reviews" ? "reviews" : "chapters";
    const currentPage = Number(page) || 1;

    const [lecture, progressInfo, latestChapterInfo, reviewResponseData] = await Promise.all([
        getLectureById(lectureId),
        getProgressByCategory(categoryApiValue),
        getLatestChapterInfo(categoryApiValue),
        currentTab === "reviews"
            ? getReviewsByLectureId(lectureId, currentPage)
            : Promise.resolve(undefined),
    ]);

    if (!lecture) {
        notFound();
    }

    if (lecture.lectureStatus !== "ACTIVE") {
        throw new Error('403|접근할 수 없는 상태의 강의입니다.');
    }

    const createReviewPageHref = (pageNumber: number) => {
        const params = new URLSearchParams();
        params.set("tab", "reviews");
        params.set("page", String(pageNumber));

        return `?${params.toString()}`;
    };

    return (
        <main className="mx-auto grid w-full max-w-360 grid-cols-1 gap-8 px-4 py-8 md:grid-cols-[minmax(0,1fr)_320px] md:px-12 md:py-12">
            <section className="min-w-0">
                <StudentPageHeader
                    backHref={`/student/${category}/lectures`}
                    breadcrumbs={[
                        {
                            label: "홈",
                            href: "/student",
                        },
                        {
                            label: `${categoryMeta.label} 강의`,
                            href: `/student/${category}/lectures`,
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
                />

                <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <StudentLectureDetailTabs
                        href={`/student/${category}/lectures/${lectureId}`}
                        currentTab={currentTab}
                        reviewCount={lecture.reviewCount}
                    />

                    {currentTab === "chapters" ? (
                        <StudentChapterList
                            category={category}
                            lectureId={lectureId}
                            chapters={lecture.chapters}
                            isEnrolled={lecture.isEnrolled}
                        />
                    ) : reviewResponseData && (
                        <>
                            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                                <ReviewSummaryButton
                                    lectureId={String(lecture.lectureId)}
                                    reviewCount={lecture.reviewCount}
                                />

                                {lecture.isEnrolled && lecture.isCompleted && (
                                    <CreateReviewBtn lectureId={lecture.lectureId} />
                                )}
                            </div>

                            <StudentReviewList reviews={reviewResponseData.content} />

                            <div className="border-t border-slate-100 px-5 pb-5">
                                <ListPagination
                                    currentPage={currentPage}
                                    totalPages={reviewResponseData.totalPages}
                                    createHref={createReviewPageHref}
                                />
                            </div>
                        </>
                    )}
                </section>
            </section>

            <aside className="sticky top-10 self-start space-y-5">
                <CategoryBuildingCard
                    category={category}
                    buildingName={categoryMeta.buildingName}
                    buildingImage={progressInfo.buildingUrl}
                    level={progressInfo.buildingLevel!}
                    currentExp={progressInfo.buildingCurrentExp!}
                    maxExp={progressInfo.buildingTotalExp!}
                />

                <LearningProgressCard
                    categoryLabel={categoryMeta.label}
                    progress={progressInfo.progressByCategory!}
                />

                {latestChapterInfo ? (
                    <ResumeLectureCard
                        href={`/student/${category}/lectures/${latestChapterInfo.lectureId}/chapters/${latestChapterInfo.chapterId}`}
                        thumbnail={latestChapterInfo.chapterThumbnailUrl}
                        title={latestChapterInfo.lectureTitle}
                        description={latestChapterInfo.chapterTitle}
                        progress={latestChapterInfo.chapterProgress}
                    />
                ) : (
                    <ResumeLectureCard empty />
                )}
            </aside>
        </main>
    );
}
