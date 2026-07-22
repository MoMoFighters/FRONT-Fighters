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
import MyLectureBuildingsOverviewCard from "@/features/lecture/components/student/list/MyLectureBuildingsOverviewCard";
import getCategoryMeta from "@/features/lecture/components/student/shared/category";
import LearningProgressCard from "@/features/lecture/components/student/shared/LearningProgressCard";
import ResumeLectureCard from "@/features/lecture/components/student/shared/ResumeLectureCard";
import StudentPageHeader from "@/features/student/components/StudentPageHeader";
import { getMyInfo } from "@/features/user/action";

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

    const [lecture, progressInfo, latestChapterInfo, reviewResponseData, myInfo] = await Promise.all([
        getLectureById(lectureId),
        getProgressByCategory(),
        getLatestChapterInfo(),
        currentTab === "reviews"
            ? getReviewsByLectureId(lectureId, currentPage)
            : Promise.resolve(undefined),
        getMyInfo(),
    ]);

    if (!lecture) {
        notFound();
    }

    const category = lecture.category.toLowerCase();
    const categoryMeta = getCategoryMeta(lecture.category);
    const chapterBaseHref = `/student/mypage/lectures/${lectureId}`;

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
                    membership={myInfo.data?.membership ?? "BASIC"}
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
                <MyLectureBuildingsOverviewCard />

                <LearningProgressCard
                    categoryLabel="전체 강의"
                    progress={progressInfo.myTotalProgress ?? 0}
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
