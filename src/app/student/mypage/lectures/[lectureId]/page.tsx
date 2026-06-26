import { notFound } from "next/navigation";

import {
    getLectureById,
    getLatestChapterInfo,
    getProgressByCategory,
    getReviewsByLectureId,
} from "@/app/services/lecture/service";
import ListPagination from "@/components/common/ListPagination";
import CreateReviewBtn from "@/features/lecture/components/buttons/CreateReviewBtn";
import StudentChapterList from "@/features/lecture/components/student/detail/StudentChapterList";
import StudentLectureDetailItem from "@/features/lecture/components/student/detail/StudentLectureDetailItem";
import StudentLectureDetailTabs from "@/features/lecture/components/student/detail/StudentLectureDetailTabs";
import StudentReviewList from "@/features/lecture/components/student/detail/StudentReviewList";
import CategoryBuildingCard from "@/features/lecture/components/student/shared/CategoryBuildingCard";
import getCategoryMeta from "@/features/lecture/components/student/shared/category";
import LearningProgressCard from "@/features/lecture/components/student/shared/LearningProgressCard";
import ResumeLectureCard from "@/features/lecture/components/student/shared/ResumeLectureCard";
import { Category } from "@/features/lecture/type";
import StudentPageHeader from "@/features/student/components/StudentPageHeader";

interface MyLectureDetailPageProps {
    params: Promise<{
        lectureId: string;
    }>;
    searchParams: Promise<{
        tab?: string;
        page?: string;
    }>;
}

export default async function MyLectureDetailPage({
    params,
    searchParams,
}: MyLectureDetailPageProps) {
    const { lectureId } = await params;
    const { tab, page } = await searchParams;
    const currentTab = tab === "reviews" ? "reviews" : "chapters";
    const currentPage = Number(page) || 1;
    const lecture = await getLectureById(lectureId);

    if (!lecture) {
        notFound();
    }

    const category = lecture.category.toLowerCase();
    const categoryMeta = getCategoryMeta(lecture.category);
    const [progressInfo, latestChapterInfo] = await Promise.all([
        getProgressByCategory(lecture.category as Category),
        getLatestChapterInfo(lecture.category as Category),
    ]);

    const reviewResponseData = currentTab === "reviews"
        ? await getReviewsByLectureId(lectureId, currentPage)
        : undefined;
    const chapterBaseHref = `/student/mypage/lectures/${lectureId}`;

    const createReviewPageHref = (pageNumber: number) => {
        const params = new URLSearchParams();
        params.set("tab", "reviews");
        params.set("page", String(pageNumber));

        return `?${params.toString()}`;
    };

    return (
        <main className="mx-auto grid w-full max-w-360 grid-cols-[minmax(0,1fr)_320px] gap-8 px-12 py-12">
            <section className="min-w-0">
                <StudentPageHeader
                    backHref="/student/mypage/lectures"
                    breadcrumbs={[
                        { label: "홈", href: "/student" },
                        { label: "마이페이지", href: "/student/mypage" },
                        { label: "내 강의", href: "/student/mypage/lectures" },
                        { label: lecture.title },
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
                        href={`/student/mypage/lectures/${lectureId}`}
                        currentTab={currentTab}
                        reviewCount={lecture.reviewCount}
                    />

                    {currentTab === "chapters" ? (
                        <StudentChapterList
                            category={category}
                            lectureId={lectureId}
                            chapters={lecture.chapters}
                            isEnrolled={lecture.isEnrolled}
                            chapterBaseHref={chapterBaseHref}
                        />
                    ) : reviewResponseData && (
                        <>
                            {lecture.isEnrolled && (
                                <div className="flex justify-end border-b border-slate-100 px-5 py-4">
                                    <CreateReviewBtn
                                        lectureId={lecture.lectureId}
                                        disabled={lecture.isCompleted !== true}
                                    />
                                </div>
                            )}

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
                        href={`/student/mypage/lectures/${latestChapterInfo.lectureId}/chapters/${latestChapterInfo.chapterId}`}
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
