import LectureItem from "@/components/common/LectureItem";
import MovePageBackBtn from "@/components/common/MovePageBackBtn";
import { Lecture } from "../page";
import LectureDetailNav from "@/features/lecture/components/common/LectureDetailNav";
import LectureDetailList from "@/features/lecture/components/common/LectureDetailList";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export interface Chapter {
    id: number;
    orderNo: number;
    title: string;
    duration: string;
}

export interface Review {
    id: number;
    name: string;
    rating: number;
    content: string;
    createdAt: string;
}

interface LectureDetailPageProps {
    params: Promise<{ lectureId: string; }>;
    searchParams: Promise<{
        tab?: string;
        page?: string
    }>
}

export default async function LectureDetailPage({ params, searchParams }: LectureDetailPageProps) {

    const { lectureId } = await params;
    const { tab, page } = await searchParams;

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

    const dummyChapters: Chapter[] = [
        { id: 1, orderNo: 1, title: '오리엔테이션 및 준비운동', duration: '10:30' },
        { id: 2, orderNo: 2, title: '상체 근력 운동 기초', duration: '15:20' },
        { id: 3, orderNo: 3, title: '하체 근력 운동 기초', duration: '12:45' },
        { id: 4, orderNo: 4, title: '코어 운동으로 체간 강화', duration: '14:00' },
        { id: 5, orderNo: 5, title: '유산소 운동 루틴', duration: '18:30' },
        { id: 6, orderNo: 6, title: '스트레칭과 마무리', duration: '10:00' },
    ];

    const dummyReviews: Review[] = [
        { id: 1, name: '홍길동', rating: 5, content: '정말 유익한 강의였습니다! 매일 아침 따라하고 있어요.', createdAt: '2024.05.15' },
        { id: 2, name: '김철수', rating: 4, content: '설명이 쉽고 자세해서 좋았습니다. 추천합니다!', createdAt: '2024.05.14' },
        { id: 3, name: '이영희', rating: 5, content: '운동 초보자도 쉽게 따라할 수 있어요.', createdAt: '2024.05.13' },
        { id: 4, name: '박민수', rating: 4, content: '체계적인 커리큘럼이 마음에 듭니다.', createdAt: '2024.05.12' },
        { id: 5, name: '최수진', rating: 5, content: '강사님이 친절하고 설명이 명확해요.', createdAt: '2024.05.11' },
        { id: 6, name: '정대호', rating: 3, content: '괜찮은 강의입니다. 다만 난이도가 조금 낮은 편.', createdAt: '2024.05.10' },
    ];

    const lecture = dummyLectures.find((lecture) => lecture.id === Number(lectureId));

    const currentPage = Number(page ?? 1);

    const REVIEWS_PER_PAGE = 5;

    const totalPages = Math.ceil(
        dummyReviews.length / REVIEWS_PER_PAGE
    );

    const paginatedReviews = dummyReviews.slice(
        (currentPage - 1) * REVIEWS_PER_PAGE,
        currentPage * REVIEWS_PER_PAGE
    );

    if (!lecture) {
        return (
            <div>
                존재하지 않는 강의입니다.
            </div>
        );
    }

    return (
        <div>
            <MovePageBackBtn href="/admin/lectures" />
            <LectureItem lecture={lecture} role="admin" mode="detail" />
            <div className="mt-10 bg-white flex flex-col border rounded-lg border-slate-200 p-6 relative">
                <LectureDetailNav href={`/admin/lectures/${lectureId}`} />
                <div className="border-t border-slate-400 mb-4" />
                <LectureDetailList role="admin" chapters={dummyChapters} reviews={paginatedReviews} />
            </div>
            {tab === "reviews" && (
                <Pagination className="mt-8">
                    <PaginationContent>

                        {currentPage > 1 && (
                            <PaginationItem>
                                <PaginationPrevious
                                    href={`?tab=reviews&page=${currentPage - 1}`}
                                />
                            </PaginationItem>
                        )}

                        {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                        ).map((pageNumber) => (

                            <PaginationItem key={pageNumber}>
                                <PaginationLink
                                    href={`?tab=reviews&page=${pageNumber}`}
                                    isActive={currentPage === pageNumber}
                                >
                                    {pageNumber}
                                </PaginationLink>
                            </PaginationItem>

                        ))}

                        {currentPage < totalPages && (
                            <PaginationItem>
                                <PaginationNext
                                    href={`?tab=reviews&page=${currentPage + 1}`}
                                />
                            </PaginationItem>
                        )}

                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}