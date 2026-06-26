import { BookOpen, SearchX } from "lucide-react";

import {
    getLatestChapterInfo,
    getLectures,
    getLecturesWithAuth,
    getProgressByCategory,
} from "@/app/services/lecture/service";
import {
    Category,
    LectureListRequest,
} from "@/features/lecture/type";

import ListPagination from "@/components/common/ListPagination";
import CategoryBuildingCard from "@/features/lecture/components/student/shared/CategoryBuildingCard";
import getCategoryMeta from "@/features/lecture/components/student/shared/category";
import LearningProgressCard from "@/features/lecture/components/student/shared/LearningProgressCard";
import ResumeLectureCard from "@/features/lecture/components/student/shared/ResumeLectureCard";
import StudentLectureList from "@/features/lecture/components/student/list/StudentLectureList";
import StudentLectureListToolbar from "@/features/lecture/components/student/list/StudentLectureListToolbar";
import StudentPageHeader from "@/features/student/components/StudentPageHeader";

interface LectureListByCategoryProps {
    searchParams: Promise<{
        keyword?: string;
        filter?: string;
        page?: string;
    }>;

    params: Promise<{
        category: string;
    }>;
}

export default async function LectureListByCategory({
    searchParams,
    params,
}: LectureListByCategoryProps) {
    const { category } = await params;
    const { keyword, filter, page } = await searchParams;

    const categoryApiValue = category.toUpperCase() as Category;
    const categoryMeta = getCategoryMeta(categoryApiValue);

    const payload: LectureListRequest = {
        category: categoryApiValue,
        keyword,
        page: Number(page) || 1,
    };

    const [
        responseData,
        progressInfo,
        latestChapterInfo,
    ] = await Promise.all([
        filter === "my"
            ? getLecturesWithAuth(payload)
            : getLectures(payload),
        getProgressByCategory(categoryApiValue),
        getLatestChapterInfo(categoryApiValue),
    ]);

    console.log(responseData.content, '?');
    console.log(progressInfo, '??');
    console.log(latestChapterInfo, '???');
    const lectures = responseData.content;
    const currentPage = Number(page) || 1;
    const totalPages = responseData.totalPages;

    const categoryLabel = categoryMeta.label;
    const buildingName = categoryMeta.buildingName;
    const buildingImage = progressInfo.buildingUrl;

    const createPageHref = (pageNumber: number) => {
        const params = new URLSearchParams();

        if (keyword) {
            params.set("keyword", keyword);
        }

        if (filter) {
            params.set("filter", filter);
        }

        params.set("page", String(pageNumber));

        return `?${params.toString()}`;
    };

    return (
        <main className="mx-auto grid w-full max-w-360 grid-cols-[minmax(0,1fr)_320px] gap-8 px-12 py-12">
            <section className="min-w-0">
                <StudentPageHeader
                    backHref={`/student/${category}`}
                    breadcrumbs={[
                        {
                            label: "홈",
                            href: "/student",
                        },
                        {
                            label: `${categoryLabel} 강의`,
                        },
                    ]}
                    title={`${categoryLabel} 강의`}
                />

                <StudentLectureListToolbar
                    keyword={keyword}
                    filter={filter}
                    totalElements={responseData.totalElements}
                />

                {lectures.length > 0 ? (
                    <>
                        <StudentLectureList
                            lectures={lectures}
                            getHref={(lecture) => `/student/${category}/lectures/${lecture.lectureId}`}
                            showLearningStatus={filter === "my"}
                        />

                        <ListPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            createHref={createPageHref}
                        />
                    </>
                ) : (
                    <div className="flex h-72 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-white text-slate-400">
                        {filter === "my" ? (
                            <BookOpen className="h-12 w-12" />
                        ) : (
                            <SearchX className="h-12 w-12" />
                        )}

                        <p className="text-lg font-bold">
                            {filter === "my"
                                ? "아직 신청한 강의가 없습니다."
                                : "검색 결과가 없습니다."}
                        </p>
                    </div>
                )}
            </section>

            <aside className="sticky mt-4 top-10 self-start space-y-5">
                <CategoryBuildingCard
                    category={category}
                    buildingName={buildingName}
                    buildingImage={buildingImage}
                    level={progressInfo.buildingLevel!}
                    currentExp={progressInfo.buildingCurrentExp!}
                    maxExp={progressInfo.buildingTotalExp!}
                />

                <LearningProgressCard
                    categoryLabel={categoryLabel}
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
