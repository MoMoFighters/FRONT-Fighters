import { Suspense } from "react";
import { BookOpen, SearchX } from "lucide-react";

import { getLectures } from "@/app/services/lecture/service";
import ListPagination from "@/components/common/ListPagination";
import GuestLectureAside from "@/features/lecture/components/guest/GuestLectureAside";
import GuestLectureControls from "@/features/lecture/components/guest/GuestLectureControls";
import GuestLectureList from "@/features/lecture/components/guest/GuestLectureList";
import GuestLectureListSkeleton from "@/features/lecture/components/guest/GuestLectureListSkeleton";
import GuestLecturePageHeader from "@/features/lecture/components/guest/GuestLecturePageHeader";
import { Category, LectureListRequest } from "@/features/lecture/type";
import {
    getNextLectureSort,
    isLectureSortOption,
    sortLectures,
} from "@/features/lecture/utils/lectureSort";

interface GuestLectureListPageProps {
    searchParams: Promise<{
        category?: string;
        keyword?: string;
        page?: string;
        sort?: string;
    }>;
}

const isCategory = (value?: string): value is Category =>
    value === "STUDY" ||
    value === "FITNESS" ||
    value === "COOK" ||
    value === "BEAUTY" ||
    value === "ART";

export default function GuestLectureListPage({
    searchParams,
}: GuestLectureListPageProps) {
    return (
        <div className="bg-white">
            <GuestLecturePageHeader />

            <div className="grid grid-cols-1 gap-8 px-4 py-6 md:grid-cols-[minmax(0,3fr)_minmax(220px,1fr)] md:px-16">
                <section className="min-w-0">
                    <Suspense fallback={<GuestLectureListSkeleton />}>
                        <GuestLectureContent searchParams={searchParams} />
                    </Suspense>
                </section>

                <GuestLectureAside />
            </div>
        </div>
    );
}

async function GuestLectureContent({
    searchParams,
}: GuestLectureListPageProps) {
    const { keyword, category, page, sort } = await searchParams;

    const normalizedCategory = category?.toUpperCase();
    const currentCategory = isCategory(normalizedCategory)
        ? normalizedCategory
        : undefined;
    const currentPage = Number(page) || 1;
    const currentSort = isLectureSortOption(sort) ? sort : "latest";

    const payload: LectureListRequest = {
        category: currentCategory,
        keyword,
        page: currentPage,
    };

    const responseData = await getLectures(payload);
    const lectures = sortLectures(responseData.content, currentSort);

    const createPageHref = (pageNumber: number) => {
        const params = new URLSearchParams();

        if (keyword) {
            params.set("keyword", keyword);
        }

        if (category) {
            params.set("category", category);
        }

        if (currentSort !== "latest") {
            params.set("sort", currentSort);
        }

        params.set("page", String(pageNumber));

        return `?${params.toString()}`;
    };

    const createSortHref = (nextSort: typeof currentSort) => {
        const params = new URLSearchParams();

        if (keyword) {
            params.set("keyword", keyword);
        }

        if (category) {
            params.set("category", category);
        }

        if (nextSort !== "latest") {
            params.set("sort", nextSort);
        }

        params.set("page", "1");

        return `?${params.toString()}`;
    };

    return (
        <>
            <GuestLectureControls
                keyword={keyword}
                category={category}
                totalElements={responseData.totalElements}
                currentSort={currentSort}
                sortHref={createSortHref(getNextLectureSort(currentSort))}
            />

            {lectures.length > 0 ? (
                <>
                    <GuestLectureList lectures={lectures} />

                    <ListPagination
                        currentPage={currentPage}
                        totalPages={responseData.totalPages}
                        createHref={createPageHref}
                    />
                </>
            ) : (
                <div className="flex h-72 flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-slate-200 bg-white text-slate-400">
                    {currentCategory ? (
                        <BookOpen className="h-11 w-11" />
                    ) : (
                        <SearchX className="h-11 w-11" />
                    )}

                    <p className="text-base font-bold">
                        조건에 맞는 강의가 없습니다.
                    </p>
                    <p className="text-xs font-medium text-slate-400">
                        검색어를 줄이거나 다른 카테고리를 선택해보세요.
                    </p>
                </div>
            )}
        </>
    );
}
