import { BookOpen, SearchX } from "lucide-react";

import { getLectures } from "@/app/services/lecture/service";
import {
    CategoryUrl,
    GetLecturesRequest,
} from "@/features/lecture/type";

import ListPagination from "@/components/common/ListPagination";
import BuildGuideCard from "@/features/lecture/components/student/BuildGuideCard";
import CategoryPreviewCard from "@/features/lecture/components/student/CategoryPreviewCard";
import getCategoryMeta from "@/features/lecture/components/student/category";
import LectureFilterBtn from "@/features/lecture/components/buttons/LectureFilterBtn";
import LectureSearchbar from "@/features/lecture/components/common/LectureSearchbar";
import StudentLectureList from "@/features/lecture/components/student/StudentLectureList";
import StudentPageHeader from "@/features/student/components/StudentPageHeader";

interface LectureListPageProps {
    searchParams: Promise<{
        category?: CategoryUrl;
        keyword?: string;
        page?: string;
    }>;
}

export default async function LectureListPage({
    searchParams,
}: LectureListPageProps) {
    const {
        keyword,
        category,
        page,
    } = await searchParams;

    const categoryMeta = category
        ? getCategoryMeta(category)
        : undefined;

    const payload: GetLecturesRequest = {
        category: categoryMeta?.apiValue,
        keyword,
        page: Number(page) || 1,
    };

    const responseData = await getLectures(payload);

    const totalPages = responseData.totalPages;
    const currentPage = Number(page) || 1;
    const defaultCategoryMeta = getCategoryMeta("study");

    const createPageHref = (pageNumber: number) => {
        const params = new URLSearchParams();

        if (keyword) {
            params.set("keyword", keyword);
        }

        if (category) {
            params.set("category", category);
        }

        params.set("page", String(pageNumber));

        return `?${params.toString()}`;
    };

    return (
        <main className="mx-auto grid w-full max-w-360 grid-cols-[minmax(0,1fr)_320px] gap-8 px-12 py-12">
            <section className="min-w-0">
                <StudentPageHeader
                    backHref="/student"
                    breadcrumbs={[
                        {
                            label: "홈",
                            href: "/student",
                        },
                        {
                            label: "媛뺤쓽 ?섎윭蹂닿린",
                        },
                    ]}
                    title="媛뺤쓽 ?섎윭蹂닿린"
                />

                <div className="mb-4 flex items-center gap-3">
                    <LectureSearchbar
                        category={category}
                        keyword={keyword}
                    />

                    <LectureFilterBtn />
                </div>

                <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-500">
                        ?꾩껜 媛뺤쓽{" "}
                        <span className="text-indigo-500">
                            {responseData.totalElements}
                        </span>
                        개
                    </p>
                </div>

                {responseData.content.length > 0 ? (
                    <>
                        <StudentLectureList
                            lectures={responseData.content}
                            category={category ?? "study"}
                            categoryLabel={categoryMeta?.label ?? "?꾩껜"}
                            buildingImage={categoryMeta?.buildingImage ?? defaultCategoryMeta.buildingImage}
                            getHref={(lecture) => `/student/lectures/${lecture.lectureId}`}
                            showLearningStatus={false}
                        />

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
                            李얠쑝?쒕뒗 媛뺤쓽媛 議댁옱?섏? ?딆뒿?덈떎.
                        </p>
                    </div>
                )}
            </section>

            <aside className="sticky mt-4 top-5 self-start space-y-5">
                <BuildGuideCard />
                <CategoryPreviewCard category={category} />
            </aside>
        </main>
    );
}
