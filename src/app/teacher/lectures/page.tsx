import LectureItem from "@/components/common/LectureItem";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface TeacherLecture {
    id: number;
    title: string;
    description: string;
    category: string;
    rating: number;
    status: string;
    studentCount: number;
}

export default function TeacherLectureList() {


    const categoryColors: Record<string, string> = {
        health: 'bg-cyan-200',
        beauty: 'bg-fuchsia-200',
        cook: 'bg-orange-200',
        study: 'bg-emerald-200',
        art: 'bg-violet-200',
    };

    const categoryMap: Record<string, string> = {
        study: '학습',
        art: '예술',
        cook: '요리',
        health: '운동',
        beauty: '뷰티',
    };

    const dummyLectures: TeacherLecture[] = [
        { id: 1, title: '당구 300 6개월 정복기', description: '당구를 입문하려는 분들께 당구의 기본 원리에 대해 설명합니다.', category: 'study', rating: 4.0, status: 'active', studentCount: 128 },
        { id: 2, title: '계절별 코디 속성 과외', description: '코디를 할 줄 모르는 사람, 옷을 뭘 사야할 지 모르는 사람들을 위한 속성 과외입니다.', category: 'study', rating: 4.5, status: 'active', studentCount: 95 },
        { id: 3, title: '방구석에서 미슐랭 투스타 따라잡기', description: '집에서 누구나 간단하게 따라할 수 있는 요리 레시피.', category: 'study', rating: 4.8, status: 'active', studentCount: 203 },
        { id: 4, title: '정보처리기사 실기 대비', description: '정보 처리기사 실기 기출문제집 풀이 및 예상 문제 대방출!', category: 'study', rating: 4.3, status: 'waiting', studentCount: 0 },
        { id: 5, title: '3대 500 잠자기보다 쉽다', description: '포기하지 않고 따라온다면 누구나 3대 500 할 수 있습니다.', category: 'study', rating: 4.6, status: 'waiting', studentCount: 0 },
        { id: 6, title: '초보자를 위한 피아노 레슨', description: '악보를 못 봐도 괜찮습니다. 처음부터 차근차근 알려드립니다.', category: 'study', rating: 0, status: 'hold', studentCount: 0 },
    ];

    const activeLectures: TeacherLecture[] = dummyLectures.filter((lecture) => lecture.status === "active");
    const waitingLectures: TeacherLecture[] = dummyLectures.filter((lecture) => lecture.status === "waiting");
    const holdLectures: TeacherLecture[] = dummyLectures.filter((lecture) => lecture.status === "hold");

    return (
        <div className="p-12">
            <div className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900">내 강의</h2>
            </div>

            <div className="grid grid-cols-3 gap-6 flex-1 min-h-0 relative">
                <div className="absolute -top-12 right-0">
                    <Link href={"/teacher/lectures/create"}>
                        <Button
                            className="px-5 py-5 bg-blue-400 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                            + 강의 등록
                        </Button>
                    </Link>
                </div>

                <div className="bg-white min-h-150 rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    <div className="bg-emerald-400 px-6 py-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            진행중
                            <span className="ml-auto text-[12px] font-normal">({activeLectures.length})</span>
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {activeLectures.map((lecture) => (
                            <LectureItem key={lecture.id} mode="teacherList" lecture={lecture} href={`/teacher/lectures/${lecture.id}`} />
                        ))}
                    </div>
                </div>

                <div className="bg-white min-h-150 rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    <div className="bg-amber-400 px-6 py-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <div className="w-2 h-2 bg-white rounded-full" />
                            승인 대기
                            <span className="ml-auto text-[12px] font-normal">({waitingLectures.length})</span>
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {waitingLectures.map((lecture) => (
                            <LectureItem key={lecture.id} mode="teacherList" lecture={lecture} href={`/teacher/lectures/${lecture.id}`} />
                        ))}
                    </div>
                </div>

                <div className="bg-white min-h-150 rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    <div className="bg-red-400 px-6 py-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <div className="w-2 h-2 bg-white rounded-full" />
                            승인 거절
                            <span className="ml-auto text-[12px] font-normal">({holdLectures.length})</span>
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {holdLectures.map((lecture) => (
                            <LectureItem key={lecture.id} mode="teacherList" lecture={lecture} href={`/teacher/lectures/${lecture.id}`} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
};