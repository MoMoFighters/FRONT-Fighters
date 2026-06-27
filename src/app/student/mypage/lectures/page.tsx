import {
    getLatestChapterInfo,
    getLecturesWithAuth,
    getProgressByCategory,
} from "@/app/services/lecture/service";
import ListPagination from "@/components/common/ListPagination";
import MyPageNav from "@/components/mypage/MyPageNav";
import LectureFilterBtn from "@/features/lecture/components/buttons/LectureFilterBtn";
import LectureSearchbar from "@/features/lecture/components/common/LectureSearchbar";
import MyLectureBuildingsOverviewCard from "@/features/lecture/components/student/list/MyLectureBuildingsOverviewCard";
import MyStudentLectureList from "@/features/lecture/components/student/list/MyStudentLectureList";
import LearningProgressCard from "@/features/lecture/components/student/shared/LearningProgressCard";
import ResumeLectureCard from "@/features/lecture/components/student/shared/ResumeLectureCard";
import { Category, LectureListRequest } from "@/features/lecture/type";
import StudentPageHeader from "@/features/student/components/StudentPageHeader";
import { BookOpen, SearchX } from "lucide-react";

interface MyLecturesListPageProps {
    searchParams: Promise<{
        category?: string;
        keyword?: string;
        page?: string;
    }>;
}

export default async function MyLecturesListPage({
    searchParams,
}: MyLecturesListPageProps) {
    const {
        keyword,
        category,
        page,
    } = await searchParams;

    const categoryApiValue = category
        ? category.toUpperCase() as Category
        : undefined;

    const payload: LectureListRequest = {
        category: categoryApiValue,
        keyword,
        enrolled: true,
        page: Number(page) || 1,
    };

    const [
        responseData,
        progressInfo,
        latestChapterInfo,
    ] = await Promise.all([
        getLecturesWithAuth(payload),
        getProgressByCategory(),
        getLatestChapterInfo(),
    ]);

    const totalPages = responseData.totalPages;
    const currentPage = Number(page) || 1;
    const lectures = responseData.content;

    const createPageHref = (pageNumber: number) => {
        const params = new URLSearchParams();

        if (category) {
            params.set("category", category);
        }

        if (keyword) {
            params.set("keyword", keyword);
        }

        params.set("page", String(pageNumber));

        return `?${params.toString()}`;
    };

    return (
        <main className="mx-auto grid w-full max-w-360 grid-cols-[minmax(0,1fr)_320px] gap-8 px-12 py-12">
            <section className="min-w-0">
                <StudentPageHeader
                    backHref="/student/mypage"
                    breadcrumbs={[
                        {
                            label: "홈",
                            href: "/student",
                        },
                        {
                            label: "마이페이지",
                            href: "/student/mypage",
                        },
                        {
                            label: "내 강의",
                        },
                    ]}
                    title="내 강의"
                />

                <MyPageNav />

                <div className="mt-8 mb-4 flex items-center gap-3">
                    <LectureSearchbar
                        category={category}
                        keyword={keyword}
                    />

                    <LectureFilterBtn />
                </div>

                <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-500">
                        전체 강의{" "}
                        <span className="text-indigo-500">
                            {responseData.totalElements}
                        </span>
                        개
                    </p>
                </div>

                {lectures.length > 0 ? (
                    <>
                        <MyStudentLectureList lectures={lectures} />

                        <ListPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            createHref={createPageHref}
                        />
                    </>
                ) : (
                    <div className="flex h-72 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-white text-slate-400">
                        {category ? (
                            <BookOpen className="h-12 w-12" />
                        ) : (
                            <SearchX className="h-12 w-12" />
                        )}

                        <p className="text-lg font-bold">
                            {category
                                ? "해당 카테고리에 수강 중인 강의가 없습니다."
                                : "아직 수강 중인 강의가 없습니다."}
                        </p>
                    </div>
                )}
            </section>

            <aside className="sticky top-10 self-start space-y-5">
                <MyLectureBuildingsOverviewCard />

                <LearningProgressCard
                    categoryLabel="전체 강의"
                    progress={progressInfo.MyTotalProgress ?? 0}
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
