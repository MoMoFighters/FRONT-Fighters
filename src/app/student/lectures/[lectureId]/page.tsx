import { notFound } from "next/navigation";

import {
    getLectureById,
    // getReviewsByLectureId,
} from "@/app/services/lecture/service";
import ListPagination from "@/components/common/ListPagination";
import CreateReviewBtn from "@/features/lecture/components/buttons/CreateReviewBtn";
import BuildGuideCard from "@/features/lecture/components/student/shared/BuildGuideCard";
import CategoryPreviewCard from "@/features/lecture/components/student/shared/CategoryPreviewCard";
import getCategoryMeta from "@/features/lecture/components/student/shared/category";
import StudentChapterList from "@/features/lecture/components/student/detail/StudentChapterList";
import StudentLectureDetailItem from "@/features/lecture/components/student/detail/StudentLectureDetailItem";
import StudentLectureDetailTabs from "@/features/lecture/components/student/detail/StudentLectureDetailTabs";
import StudentReviewList from "@/features/lecture/components/student/detail/StudentReviewList";
import { ReviewResponse } from "@/features/lecture/type";
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

const DUMMY_REVIEW_RESPONSE: ReviewResponse = {
    content: [
        {
            reviewId: 1,
            userId: 1,
            nickname: "모모시민",
            profileImageUrl: "",
            content: "수강평 API 연동 전 화면 확인용 더미 수강평입니다.",
            rating: 5,
            createdAt: "2026.06.25",
        },
    ],
    page: 1,
    size: 5,
    totalElements: 1,
    totalPages: 1,
};

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

    const currentTab = tab === "reviews" ? "reviews" : "chapters";
    const currentPage = Number(page) || 1;

    // TODO: 수강평 목록 조회 API 완성 후 아래 더미 응답을 getReviewsByLectureId 호출로 교체
    // const reviewResponseData = currentTab === "reviews"
    //     ? await getReviewsByLectureId(lectureId, currentPage)
    //     : undefined;
    const reviewResponseData = currentTab === "reviews"
        ? DUMMY_REVIEW_RESPONSE
        : undefined;

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
                    position={position ?? ""}
                    resumeChapterId={resumeChapter?.chapterId}
                />

                <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <StudentLectureDetailTabs
                        href={lectureDetailHref}
                        currentTab={currentTab}
                        reviewCount={DUMMY_REVIEW_RESPONSE.totalElements}
                    />

                    {currentTab === "chapters" ? (
                        <StudentChapterList
                            category={category}
                            lectureId={lectureId}
                            chapters={chapters}
                            isEnrolled={false} />
                    ) : reviewResponseData && (
                        <>
                            <div className="flex justify-end border-b border-slate-100 px-5 py-4">
                                <CreateReviewBtn disabled={lecture.isCompleted !== true} />
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

            <aside className="sticky mt-4 top-10 self-start space-y-5">
                <BuildGuideCard />
                <CategoryPreviewCard />
            </aside>
        </main>
    );
}
