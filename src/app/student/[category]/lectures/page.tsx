import { Lecture } from "@/app/admin/lectures/page";

import LectureItem from "@/components/common/LectureItem";

import LectureSearchbar from "@/features/lecture/LectureSearchbar";
import StudentLectureNav from "@/features/lecture/StudentLectureNav";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

import {
    BookOpen,
    SearchX
} from "lucide-react";

interface LectureListByCategoryProps {
    searchParams: Promise<{
        keyword?: string;
        tab?: string;
        page?: string;
    }>;

    params: Promise<{
        category: string;
    }>;
}

export default async function LectureListByCategory({
    searchParams,
    params
}: LectureListByCategoryProps) {

    const { category } =
        await params;

    const {
        keyword,
        tab,
        page
    } = await searchParams;

    const currentPage =
        Number(page) || 1;

    const ITEMS_PER_PAGE = 5;

    const dummyLectures: Lecture[] = [
        {
            id: 1,
            title: '당구 300 6개월 정복기',
            description: '당구를 입문하려는 분들께 당구의 기본 원리에 대해 설명합니다.',
            category: 'health',
            rating: 4.0,
            status: 'active'
        },
        {
            id: 2,
            title: '계절별 코디 속성 과외',
            description: '코디를 할 줄 모르는 사람, 옷을 뭘 사야할 지 모르는 사람들을 위한 속성 과외입니다.',
            category: 'beauty',
            rating: 4.0,
            status: 'waiting'
        },
        {
            id: 3,
            title: '방구석에서 미슐랭 투스타 따라잡기',
            description: '집에서 누구나 간단하게 따라할 수 있는 요리 레시피.',
            category: 'cook',
            rating: 4.0,
            status: 'active'
        },
        {
            id: 4,
            title: '정보처리기사 실기 대비',
            description: '정보 처리기사 실기 기출문제집 풀이 및 예상 문제 대방출!',
            category: 'study',
            rating: 4.0,
            status: 'active'
        },
        {
            id: 5,
            title: '3대 500 잠자기보다 쉽다',
            description: '포기하지 않고 따라온다면 누구나 3대 500 할 수 있습니다.',
            category: 'health',
            rating: 4.0,
            status: 'waiting'
        },
        {
            id: 6,
            title: '통기타 마스터 도전기',
            description: '통기타의 기초부터 마스터까지 모든 과정을 상세히 알려드립니다.',
            category: 'art',
            rating: 4.0,
            status: 'waiting'
        },
        {
            id: 7,
            title: '정보처리기사 실기 대비1',
            description: '정보 처리기사 실기 기출문제집 풀이 및 예상 문제 대방출!',
            category: 'study',
            rating: 4.0,
            status: 'active'
        },
        {
            id: 8,
            title: '정보처리기사 실기 대비2',
            description: '정보 처리기사 실기 기출문제집 풀이 및 예상 문제 대방출!',
            category: 'study',
            rating: 4.0,
            status: 'active'
        },
        {
            id: 9,
            title: '정보처리기사 실기 대비3',
            description: '정보 처리기사 실기 기출문제집 풀이 및 예상 문제 대방출!',
            category: 'study',
            rating: 4.0,
            status: 'active'
        },
        {
            id: 10,
            title: '정보처리기사 실기 대비4',
            description: '정보 처리기사 실기 기출문제집 풀이 및 예상 문제 대방출!',
            category: 'study',
            rating: 4.0,
            status: 'active'
        },
        {
            id: 11,
            title: '정보처리기사 실기 대비5',
            description: '정보 처리기사 실기 기출문제집 풀이 및 예상 문제 대방출!',
            category: 'study',
            rating: 4.0,
            status: 'active'
        },
        {
            id: 12,
            title: '정보처리기사 실기 대비6',
            description: '정보 처리기사 실기 기출문제집 풀이 및 예상 문제 대방출!',
            category: 'study',
            rating: 4.0,
            status: 'active'
        },
        {
            id: 13,
            title: '정보처리기사 실기 대비7',
            description: '정보 처리기사 실기 기출문제집 풀이 및 예상 문제 대방출!',
            category: 'study',
            rating: 4.0,
            status: 'active'
        },
    ];

    const filteredLectures =
        dummyLectures.filter((lecture) => {

            // 승인된 강의만 조회
            if (lecture.status !== "active") {
                return false;
            }

            // 실제로는 category 기준 API 조회
            if (
                category &&
                lecture.category !== category
            ) {
                return false;
            }

            // keyword 필터
            if (
                keyword &&
                !lecture.title.includes(keyword) &&
                !lecture.description.includes(keyword)
            ) {
                return false;
            }

            // 내 강의 탭 테스트용
            if (
                tab === "my" &&
                lecture.id % 2 === 0
            ) {
                return false;
            }

            return true;
        });

    const totalCount =
        filteredLectures.length;

    const totalPages =
        Math.ceil(
            totalCount / ITEMS_PER_PAGE
        );

    const paginatedLectures =
        filteredLectures.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
        );

    const createPageHref = (
        pageNumber: number
    ) => {

        const params =
            new URLSearchParams();

        if (keyword) {
            params.set(
                "keyword",
                keyword
            );
        }

        if (tab) {
            params.set(
                "tab",
                tab
            );
        }

        params.set(
            "page",
            String(pageNumber)
        );

        return `?${params.toString()}`;
    };

    return (
        <div className="p-12">

            <StudentLectureNav
                category={category}
            />

            <div className="flex items-center gap-3 mb-4">

                <LectureSearchbar
                    keyword={keyword}
                />

            </div>

            <div className="border-t border-slate-400 mb-4" />

            {filteredLectures.length > 0 ? (

                <>
                    <div className="space-y-3">

                        {paginatedLectures.map((lecture) => (

                            <LectureItem
                                key={lecture.id}
                                lecture={lecture}
                                role="student"
                                mode="list"
                                href={`/student/${category}/lectures/${lecture.id}`}
                            />
                        ))}

                    </div>

                    {totalPages > 1 && (

                        <Pagination className="mt-10">

                            <PaginationContent>

                                {currentPage > 1 && (
                                    <PaginationItem>

                                        <PaginationPrevious
                                            href={createPageHref(
                                                currentPage - 1
                                            )}
                                        />

                                    </PaginationItem>
                                )}

                                {Array.from(
                                    { length: totalPages },
                                    (_, index) => {

                                        const pageNumber =
                                            index + 1;

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
                                        />

                                    </PaginationItem>
                                )}

                            </PaginationContent>

                        </Pagination>
                    )}
                </>

            ) : (

                <div
                    className="
                        h-60
                        flex flex-col
                        justify-center items-center
                        gap-5

                        text-2xl
                        text-slate-300
                        font-bold
                    "
                >

                    {tab === "my" ? (

                        <>
                            <BookOpen
                                className="
                                    w-12 h-12
                                    text-slate-300
                                "
                            />

                            <span className="text-center whitespace-pre-line">
                                아직 신청한 강의가 없습니다.
                            </span>
                        </>

                    ) : (

                        <>
                            <SearchX
                                className="
                                    w-12 h-12
                                    text-slate-300
                                "
                            />

                            <span className="text-center whitespace-pre-line">
                                찾으시는 강의가 존재하지 않습니다.
                            </span>
                        </>
                    )}

                </div>
            )}

        </div>
    );
}