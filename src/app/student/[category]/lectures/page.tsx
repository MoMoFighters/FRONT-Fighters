import Image, { StaticImageData } from "next/image";
import Link from "next/link";

import {
    ArrowLeft,
    BookOpen,
    SearchX,
} from "lucide-react";

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
import LectureSearchbar from "@/features/lecture/components/common/LectureSearchbar";
import { Progress } from "@/components/ui/progress";
import StudentLectureItem from "@/components/common/StudentLectureItem";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import StudentLectureNav from "@/features/lecture/components/student/StudentLectureNav";

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
    fitness: "헬스장",
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

const LectureProgress = (isEnrolled?: boolean, index = 0) => {
    if (!isEnrolled) {
        return 0;
    }

    return index % 2 === 0 ? 35 : 60;
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

    // 하드코딩 - 수정 필요
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
            {/* 최상단 - 현재 페이지 위치 */}
            <section className="min-w-0">
                <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
                    <Link
                        href={`/student/${category}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg hover:text-slate-900 hover:-translate-y-0.5"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>

                    <Link href="/student" className="hover:text-slate-900 hover:font-bold">
                        홈
                    </Link>

                    <span>/</span>

                    <span className="font-medium text-slate-700">
                        {categoryLabel} 강의
                    </span>
                </div>

                <div className="mb-7 flex justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                            {categoryLabel} 강의
                        </h1>
                    </div>
                </div>

                <StudentLectureNav keyword={keyword} filter={filter} />
                <div className="mb-4">
                    <LectureSearchbar keyword={keyword} filter={filter} />
                </div>

                <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-500">
                        전체{" "}
                        <span className="text-indigo-500">
                            {responseData.totalElements}
                        </span>
                        개
                    </p>
                </div>

                {responseData.content.length > 0 ? (
                    <>
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            {responseData.content.map((lecture, index) => (
                                <StudentLectureItem
                                    key={lecture.id}
                                    lecture={lecture}
                                    href={`/student/${category}/lectures/${lecture.id}`}
                                    categoryLabel={categoryLabel}
                                    buildingImage={buildingImage}
                                    progress={LectureProgress(
                                        lecture.isEnrolled,
                                        index
                                    )}
                                />
                            ))}
                        </div>

                        {/* 페이지네이션 */}
                        {totalPages > 1 && (
                            <Pagination className="mt-8">
                                <PaginationContent>
                                    {currentPage > 1 && (
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href={createPageHref(
                                                    currentPage - 1
                                                )}
                                                text=""
                                                className="h-9 w-9 border border-slate-200 bg-white p-0 text-slate-500 hover:text-slate-900"
                                            />
                                        </PaginationItem>
                                    )}

                                    {Array.from(
                                        { length: totalPages },
                                        (_, index) => {
                                            const pageNumber = index + 1;

                                            return (
                                                <PaginationItem
                                                    key={pageNumber}
                                                >
                                                    <PaginationLink
                                                        href={createPageHref(
                                                            pageNumber
                                                        )}
                                                        isActive={
                                                            currentPage ===
                                                            pageNumber
                                                        }
                                                        className={
                                                            currentPage ===
                                                                pageNumber
                                                                ? "border-indigo-300 bg-indigo-50 text-indigo-500 hover:bg-indigo-50"
                                                                : "text-slate-500 hover:border-slate-200 hover:bg-white hover:text-slate-900"
                                                        }
                                                    >
                                                        {pageNumber}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        }
                                    )}

                                    {currentPage < totalPages && (
                                        <PaginationItem>
                                            <PaginationNext
                                                href={createPageHref(
                                                    currentPage + 1
                                                )}
                                                text=""
                                                className="h-9 w-9 border border-slate-200 bg-white p-0 text-slate-500 hover:text-slate-900"
                                            />
                                        </PaginationItem>
                                    )}
                                </PaginationContent>
                            </Pagination>
                        )}
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
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-base font-bold text-slate-950">
                        나의 MoMoCITY
                    </h2>

                    <div className="relative mx-auto mt-4 h-40 w-40">
                        <Image
                            src={buildingImage}
                            alt={`${buildingName} 이미지`}
                            fill
                            sizes="160px"
                            className="object-contain"
                        />
                    </div>

                    {/* exp로 하드 코딩 - 추후 레벨업 기준 강의 개수 표시 */}
                    <div className="mt-5">
                        <p className="text-sm font-bold text-slate-950">
                            {buildingName} 성장 현황
                        </p>

                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-sm font-bold text-indigo-500">
                                Lv. {buildingLevel}
                            </span>

                            <span className="text-xs font-medium text-slate-500">
                                {currentExp} / {maxExp} XP
                            </span>
                        </div>

                        <Progress value={Math.round((currentExp / maxExp) * 100)} className="mt-2" />
                    </div>

                    {/* 없어도 될 기능 - 상의 필요 */}
                    <Link
                        href={`/student/${category}`}
                        className="mt-6 flex h-12 items-center justify-center rounded-xl border border-indigo-300 text-sm font-bold text-indigo-500 transition hover:bg-indigo-50"
                    >
                        건물 보기
                    </Link>
                </section>

                {/* 카테고리 별 강의 총 진척도 */}
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-base font-bold text-slate-950">
                        나의 학습 현황
                    </h2>

                    <div className="mt-5 flex flex-col items-center">
                        <div
                            className="relative flex h-36 w-36 items-center justify-center rounded-full"
                            style={{
                                background: `conic-gradient(rgb(129 140 248) ${categoryProgress * 3.6}deg, rgb(226 232 240) 0deg)`,
                            }}
                        >
                            <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white shadow-inner">
                                <span className="text-3xl font-black text-slate-950">
                                    {categoryProgress}%
                                </span>

                                <span className="mt-1 text-xs font-semibold text-slate-400">
                                    전체 진도율
                                </span>
                            </div>
                        </div>

                        <p className="mt-5 text-center text-sm font-medium leading-6 text-slate-500">
                            {categoryLabel} 건물의 전체 강의 기준
                            <br />
                            총 학습 진척도입니다.
                        </p>
                    </div>
                </section>

                {/* 이어보기 하드코딩 - 추후 구현할 건지 상의 필요 */}
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-base font-bold text-slate-950">
                        이어보기
                    </h2>

                    <div className="mt-4 flex gap-3">
                        <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-slate-100">
                            <Image
                                src={buildingImage}
                                alt="이어보기 강의"
                                fill
                                sizes="64px"
                                className="object-cover"
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-slate-900">
                                생활 영어 회화
                            </p>

                            <p className="mt-1 truncate text-xs font-medium text-slate-500">
                                여행에서 쓰는 영어
                            </p>

                            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                                <div className="h-full w-[35%] rounded-full bg-indigo-400" />
                            </div>
                        </div>
                    </div>

                    <Link
                        href={`/student/${category}/lectures`}
                        className="mt-4 flex h-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white transition hover:bg-slate-800"
                    >
                        이어서 보기
                    </Link>
                </section>
            </aside>
        </main>
    );
}
