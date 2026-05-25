import LectureItem from "@/components/common/LectureItem";
import LectureManageNav from "@/features/lecture/admin/LectureManageNav";
import LectureFilterBtn from "@/features/lecture/LectureFilterBtn";
import LectureSearchbar from "@/features/lecture/LectureSearchbar";
import Link from "next/link";

export interface Lecture {
    id: number;
    title: string;
    description: string;
    category: string;
    status: string;
    rating: number;
}

export default async function AdminLectureListPage({ searchParams }: {
    searchParams: Promise<{
        status?: string;
        category?: string;
        keyword?: string;
    }>
}) {

    const { status, keyword, category } = await searchParams;

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
    ];

    const filteredLectures: Lecture[] = dummyLectures.filter((lecture) => {

        // status 필터
        if (status && lecture.status !== status) {
            return false;
        }

        // category 필터
        if (category && lecture.category !== category) {
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

        return true;
    });

    return (
        <div>
            <div className="flex items-center gap-3 mb-10">
                <div className="w-2 h-7 bg-slate-500 rounded-full" />
                <h2 className="text-2xl font-bold text-slate-900">강의 관리</h2>
            </div>
            <LectureManageNav />
            <div className="flex items-center gap-3 mb-4">
                <LectureSearchbar status={status} category={category} keyword={keyword} />
                <LectureFilterBtn />
            </div>
            <div className="border-t border-slate-400 mb-4" />
            <div className="space-y-3">
                {filteredLectures.map((lecture) => (
                    <Link key={lecture.id} href={`/admin/lectures/${lecture.id}`}>
                        <LectureItem key={lecture.id} lecture={lecture} role="admin" mode="list" />
                    </Link>
                ))}
            </div>
        </div>

    );
}