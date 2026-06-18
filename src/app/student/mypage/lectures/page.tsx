import { getLecturesWithAuth } from "@/app/services/lecture/service";
import ListPagination from "@/components/common/ListPagination";
import MyPageNav from "@/components/mypage/MyPageNav";
import LectureFilterBtn from "@/features/lecture/components/buttons/LectureFilterBtn";
import LectureSearchbar from "@/features/lecture/components/common/LectureSearchbar";
import CategoryBuildingCard from "@/features/lecture/components/student/shared/CategoryBuildingCard";
import getCategoryMeta from "@/features/lecture/components/student/shared/category";
import LearningProgressCard from "@/features/lecture/components/student/shared/LearningProgressCard";
import MyStudentLectureList from "@/features/lecture/components/student/list/MyStudentLectureList";
import MyLectureBuildingsOverviewCard from "@/features/lecture/components/student/list/MyLectureBuildingsOverviewCard";
import ResumeLectureCard from "@/features/lecture/components/student/shared/ResumeLectureCard";
import StudentPageHeader from "@/features/student/components/StudentPageHeader";
import { Category, LectureListRequest } from "@/features/lecture/type";
import { BookOpen, SearchX } from "lucide-react";

interface MyLecturesListPageProps {
    searchParams: Promise<{
        category?: string;
        keyword?: string;
        page?: string;
    }>;
}

const getAverageProgress = (lectures: { lectureProgress?: number }[]) => {
    if (lectures.length === 0) {
        return 0;
    }

    const total = lectures.reduce((sum, lecture) => (
        sum + (lecture.lectureProgress ?? 0)
    ), 0);

    return Math.round(total / lectures.length);
};

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
    const categoryMeta = categoryApiValue
        ? getCategoryMeta(categoryApiValue)
        : undefined;

    const payload: LectureListRequest = {
        category: categoryApiValue,
        keyword,
        enrolled: true,
        page: Number(page) || 1,
    };

    const responseData = await getLecturesWithAuth(payload);

    const totalPages = responseData.totalPages;
    const currentPage = Number(page) || 1;
    const lectures = responseData.content;

    const progress = getAverageProgress(lectures);

    // 하드코딩 - 추후 실제 건물 성장 데이터로 교체 필요
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
    };

    const resumeLecture = lectures[0];
    const resumeCategoryMeta = resumeLecture
        ? getCategoryMeta(resumeLecture.category)
        : undefined;

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
                            progress={progress}
                        />

                        {resumeLecture && resumeCategoryMeta && (
                            <ResumeLectureCard
                                href={`/student/mypage/lectures/${resumeLecture.lectureId}`}
                                thumbnail={resumeCategoryMeta.buildingImage}
                                title={resumeLecture.title}
                                description={resumeLecture.description}
                                progress={resumeLecture.lectureProgress ?? 0}
                            />
                        )}
                    </>
                ) : (
                    <>
                        <MyLectureBuildingsOverviewCard />

                        <LearningProgressCard
                            categoryLabel="전체 강의"
                            progress={progress}
                        />

                        {resumeLecture && resumeCategoryMeta && (
                            <ResumeLectureCard
                                href={`/student/mypage/lectures/${resumeLecture.lectureId}`}
                                thumbnail={resumeCategoryMeta.buildingImage}
                                title={resumeLecture.title}
                                description={resumeLecture.description}
                                progress={resumeLecture.lectureProgress ?? 0}
                            />
                        )}
                    </>
                )}
            </aside>
        </main>
    );
}
