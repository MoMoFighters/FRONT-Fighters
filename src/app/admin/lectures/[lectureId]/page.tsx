import { notFound } from "next/navigation";

import { getLectureById } from "@/app/services/lecture/service";
import ListPagination from "@/components/common/ListPagination";
import AdminChapterList from "@/features/lecture/components/admin/AdminChapterList";
import AdminLectureDetailHero from "@/features/lecture/components/admin/AdminLectureDetailHero";
import AdminReviewList from "@/features/lecture/components/admin/AdminReviewList";
import StudentLectureDetailTabs from "@/features/lecture/components/student/detail/StudentLectureDetailTabs";
import StudentPageHeader from "@/features/student/components/StudentPageHeader";
import { Review } from "@/features/lecture/type";

interface AdminLectureDetailPageProps {
    params: Promise<{ lectureId: string }>;
    searchParams: Promise<{ tab?: string; page?: string }>;
}

const DUMMY_ADMIN_REVIEWS: Review[] = [
    // TODO: 관리자 강의 상세 API에 수강평 목록이 포함되면 해당 응답으로 교체한다.
    { reviewId: 1, userId: 101, userName: "모모시티러버", rating: 5, content: "설명이 자세하고 따라가기 쉬웠어요. 꾸준히 듣기 좋은 강의입니다.", createdAt: "2026.06.10" },
    { reviewId: 2, userId: 102, userName: "학습러", rating: 4, content: "챕터 구성이 깔끔해서 흐름을 놓치지 않고 볼 수 있었습니다.", createdAt: "2026.06.09" },
    { reviewId: 3, userId: 103, userName: "민수", rating: 5, content: "초보자도 부담 없이 시작할 수 있는 난이도라 만족합니다.", createdAt: "2026.06.08" },
    { reviewId: 4, userId: 104, userName: "성장중", rating: 4, content: "실습 예시가 조금 더 많으면 더 좋을 것 같아요.", createdAt: "2026.06.07" },
    { reviewId: 5, userId: 105, userName: "도시건설자", rating: 5, content: "짧은 챕터 단위라 매일 듣기 편합니다.", createdAt: "2026.06.06" },
    { reviewId: 6, userId: 106, userName: "꾸준함", rating: 4, content: "기초부터 차근차근 설명해서 이해하기 좋았습니다.", createdAt: "2026.06.05" },
];

export default async function AdminLectureDetailPage({
    params,
    searchParams,
}: AdminLectureDetailPageProps) {
    const { lectureId } = await params;
    const { tab, page } = await searchParams;
    const lecture = await getLectureById(lectureId);

    if (!lecture) notFound();

    const currentTab = tab === "reviews" ? "reviews" : "chapters";
    const currentPage = Number(page) || 1;
    const reviewsPerPage = 5;
    const reviews = lecture.reviews?.length ? lecture.reviews : DUMMY_ADMIN_REVIEWS;
    const reviewTotalPages = Math.ceil(reviews.length / reviewsPerPage);
    const visibleReviews = reviews.slice(
        (currentPage - 1) * reviewsPerPage,
        currentPage * reviewsPerPage,
    );
    const createReviewPageHref = (pageNumber: number) => `?tab=reviews&page=${pageNumber}`;

    return (
        <main className="mx-auto w-full max-w-360 pb-10">
            <StudentPageHeader
                backHref="/admin/lectures"
                breadcrumbs={[
                    { label: "관리자", href: "/admin" },
                    { label: "강의 관리", href: "/admin/lectures" },
                    { label: lecture.title },
                ]}
                title={lecture.title}
            />

            <AdminLectureDetailHero lecture={lecture} reviewCount={reviews.length} />

            <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <StudentLectureDetailTabs
                    href={`/admin/lectures/${lectureId}`}
                    currentTab={currentTab}
                    reviewCount={reviews.length}
                />

                {currentTab === "chapters" ? (
                    <AdminChapterList lectureId={lectureId} chapters={lecture.chapters} />
                ) : (
                    <>
                        <AdminReviewList reviews={visibleReviews} />
                        <div className="border-t border-slate-100 px-5 pb-5">
                            <ListPagination
                                currentPage={currentPage}
                                totalPages={reviewTotalPages}
                                createHref={createReviewPageHref}
                            />
                        </div>
                    </>
                )}
            </section>
        </main>
    );
}
