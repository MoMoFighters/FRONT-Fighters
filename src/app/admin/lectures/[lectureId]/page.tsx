import { notFound } from "next/navigation";

import {
    getLectureById,
    getReviewsByLectureId,
} from "@/app/services/lecture/service";
import ListPagination from "@/components/common/ListPagination";
import AdminChapterList from "@/features/lecture/components/admin/AdminChapterList";
import AdminLectureDetailHero from "@/features/lecture/components/admin/AdminLectureDetailHero";
import AdminReviewList from "@/features/lecture/components/admin/AdminReviewList";
import StudentLectureDetailTabs from "@/features/lecture/components/student/detail/StudentLectureDetailTabs";
import StudentPageHeader from "@/features/student/components/StudentPageHeader";

interface AdminLectureDetailPageProps {
    params: Promise<{ lectureId: string }>;
    searchParams: Promise<{ tab?: string; page?: string }>;
}

export default async function AdminLectureDetailPage({
    params,
    searchParams,
}: AdminLectureDetailPageProps) {
    const { lectureId } = await params;
    const { tab, page } = await searchParams;
    const currentTab = tab === "reviews" ? "reviews" : "chapters";
    const currentPage = Number(page) || 1;
    const lecture = await getLectureById(lectureId);

    if (!lecture) notFound();

    const reviewResponseData = currentTab === "reviews"
        ? await getReviewsByLectureId(lectureId, currentPage)
        : undefined;

    const createReviewPageHref = (pageNumber: number) => (
        `?tab=reviews&page=${pageNumber}`
    );

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

            <AdminLectureDetailHero
                lecture={lecture}
                reviewCount={lecture.reviewCount}
            />

            <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <StudentLectureDetailTabs
                    href={`/admin/lectures/${lectureId}`}
                    currentTab={currentTab}
                    reviewCount={lecture.reviewCount}
                />

                {currentTab === "chapters" ? (
                    <AdminChapterList lectureId={lectureId} chapters={lecture.chapters} />
                ) : reviewResponseData && (
                    <>
                        <AdminReviewList
                            lectureId={lectureId}
                            reviews={reviewResponseData.content}
                        />
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
        </main>
    );
}
