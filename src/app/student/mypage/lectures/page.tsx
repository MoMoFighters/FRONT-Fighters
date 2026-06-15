import { getLectures } from "@/app/services/lecture/service";
import ListPagination from "@/components/common/ListPagination";
import MyPageNav from "@/components/mypage/MyPageNav";
import LectureFilterBtn from "@/features/lecture/components/buttons/LectureFilterBtn";
import LectureSearchbar from "@/features/lecture/components/common/LectureSearchbar";
import CategoryBuildingCard from "@/features/lecture/components/student/CategoryBuildingCard";
import getCategoryMeta from "@/features/lecture/components/student/category";
import LearningProgressCard from "@/features/lecture/components/student/LearningProgressCard";
import MyStudentLectureList from "@/features/lecture/components/student/MyStudentLectureList";
import MyLectureBuildingsOverviewCard from "@/features/lecture/components/student/MyLectureBuildingsOverviewCard";
import ResumeLectureCard from "@/features/lecture/components/student/ResumeLectureCard";
import StudentPageHeader from "@/features/student/components/StudentPageHeader";
import {
    CategoryApiUrl,
    CategoryUrl,
    GetLecturesRequest,
} from "@/features/lecture/type";
import { BookOpen, SearchX } from "lucide-react";

const CATEGORY_URL_MAP: Record<CategoryApiUrl, CategoryUrl> = {
    STUDY: "study",
    FITNESS: "fitness",
    COOK: "cook",
    BEAUTY: "beauty",
    ART: "art",
};

interface MyLecturesListPageProps {
    searchParams: Promise<{
        category?: CategoryUrl;
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

    const categoryMeta = category
        ? getCategoryMeta(category)
        : undefined;

    const payload: GetLecturesRequest = {
        category: categoryMeta?.apiValue,
        keyword,
        enrolled: true,
        page: Number(page) || 1,
    };

    const responseData = await getLectures(payload);

    const totalPages = responseData.totalPages;
    const currentPage = Number(page) || 1;

    // 하드코딩 - 추후 실제 학습/건물 성장 데이터로 교체 필요
    const categoryProgress = 42;
    const buildingLevel = 3;
    const currentExp = 320;
    const maxExp = 600;

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
    }

    // 하드코딩 - 추후 실제 이어보기 API 데이터로 교체 필요
    const resumeLecture = responseData.content[0];
    const resumeCategory = resumeLecture
        ? CATEGORY_URL_MAP[resumeLecture.category]
        : undefined;
    const resumeCategoryMeta = categoryMeta
        ?? (resumeCategory ? getCategoryMeta(resumeCategory) : undefined);

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
                        전체 수강 강의{" "}
                        <span className="text-indigo-500">
                            {responseData.totalElements}
                        </span>
                        개
                    </p>
                </div>

                {responseData.content.length > 0 ? (
                    <>
                        <MyStudentLectureList lectures={responseData.content} />

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
                {category && categoryMeta ? (
                    <>
                        <CategoryBuildingCard
                            category={category}
                            buildingName={categoryMeta.buildingName}
                            buildingImage={categoryMeta.buildingImage}
                            level={buildingLevel}
                            currentExp={currentExp}
                            maxExp={maxExp}
                        />

                        <LearningProgressCard
                            categoryLabel={categoryMeta.label}
                            progress={categoryProgress}
                        />

                        {resumeLecture && resumeCategoryMeta && resumeCategory && (
                            <ResumeLectureCard
                                href={`/student/${resumeCategory}/lectures/${resumeLecture.id}`}
                                thumbnail={resumeCategoryMeta.buildingImage}
                                title={resumeLecture.title}
                                description={resumeLecture.description}
                                progress={35}
                            />
                        )}
                    </>
                ) : (
                    <>
                        <MyLectureBuildingsOverviewCard />

                        {resumeLecture && resumeCategoryMeta && resumeCategory && (
                            <ResumeLectureCard
                                href={`/student/${resumeCategory}/lectures/${resumeLecture.id}`}
                                thumbnail={resumeCategoryMeta.buildingImage}
                                title={resumeLecture.title}
                                description={resumeLecture.description}
                                progress={35}
                            />
                        )}
                    </>
                )}
            </aside>
        </main>
    );
}
