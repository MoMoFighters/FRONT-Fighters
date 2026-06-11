import { StaticImageData } from "next/image";
import { BookOpen, SearchX } from "lucide-react";

import { getLectures } from "@/app/services/lecture/service";
import {
    CategoryApiUrl,
    CategoryUrl,
    GetLecturesRequest,
} from "@/features/lecture/type";

import school from "@/app/assets/img/school.png";
import arthall from "@/app/assets/img/arthall.png";
import health from "@/app/assets/img/health.png";
import cook from "@/app/assets/img/cook.png";
import beauty from "@/app/assets/img/beauty.png";
import ListPagination from "@/components/common/ListPagination";
import CategoryBuildingCard from "@/features/lecture/components/student/CategoryBuildingCard";
import LearningProgressCard from "@/features/lecture/components/student/LearningProgressCard";
import ResumeLectureCard from "@/features/lecture/components/student/ResumeLectureCard";
import StudentLectureList from "@/features/lecture/components/student/StudentLectureList";
import StudentLectureListToolbar from "@/features/lecture/components/student/StudentLectureListToolbar";
import StudentPageHeader from "@/features/student/components/StudentPageHeader";

const CATEGORY_MAP: Record<CategoryUrl, CategoryApiUrl> = {
    study: "STUDY",
    fitness: "FITNESS",
    cook: "COOK",
    beauty: "BEAUTY",
    art: "ART",
};

const CATEGORY_LABEL_MAP: Record<CategoryUrl, string> = {
    study: "학습",
    fitness: "운동",
    cook: "요리",
    beauty: "뷰티",
    art: "예술",
};

const CATEGORY_BUILDING_MAP: Record<CategoryUrl, string> = {
    study: "학교",
    fitness: "피트니스센터",
    cook: "식당",
    beauty: "백화점",
    art: "아트홀",
};

const CATEGORY_IMAGE_MAP: Record<CategoryUrl, StaticImageData> = {
    study: school,
    fitness: health,
    cook,
    beauty,
    art: arthall,
};

interface LectureListByCategoryProps {
    searchParams: Promise<{
        keyword?: string;
        filter?: string;
        page?: string;
    }>;

    params: Promise<{
        category: CategoryUrl;
    }>;
}

export default async function LectureListByCategory({
    searchParams,
    params,
}: LectureListByCategoryProps) {
    const { category } = await params;
    const { keyword, filter, page } = await searchParams;

    const payload: GetLecturesRequest = {
        category: CATEGORY_MAP[category],
        keyword,
        enrolled: filter === "my",
        page: Number(page) || 1,
    };

    const responseData = await getLectures(payload);

    const currentPage = Number(page) || 1;
    const totalPages = responseData.totalPages;

    const categoryLabel = CATEGORY_LABEL_MAP[category];
    const buildingName = CATEGORY_BUILDING_MAP[category];
    const buildingImage = CATEGORY_IMAGE_MAP[category];

    // 하드코딩 - 추후 실제 학습/건물 성장 데이터로 교체 필요
    const categoryProgress = 42;
    const buildingLevel = 3;
    const currentExp = 320;
    const maxExp = 600;

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

                {responseData.content.length > 0 ? (
                    <>
                        <StudentLectureList
                            lectures={responseData.content}
                            category={category}
                            categoryLabel={categoryLabel}
                            buildingImage={buildingImage}
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

            <aside className="sticky top-24 h-fit space-y-5">
                <CategoryBuildingCard
                    category={category}
                    buildingName={buildingName}
                    buildingImage={buildingImage}
                    level={buildingLevel}
                    currentExp={currentExp}
                    maxExp={maxExp}
                />

                <LearningProgressCard
                    categoryLabel={categoryLabel}
                    progress={categoryProgress}
                />

                <ResumeLectureCard
                    href={`/student/${category}/lectures`}
                    thumbnail={buildingImage}
                    title="생활 영어 회화"
                    description="여행에서 쓰는 영어"
                    progress={35}
                />
            </aside>
        </main>
    );
}
