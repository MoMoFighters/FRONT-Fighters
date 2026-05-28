import { Button } from "@/components/ui/button";
import { BookOpenText, Plus, Star, Users } from "lucide-react";
import Link from "next/link";
import { TeacherLecture } from "./lectures/page";
import LectureItem from "@/components/common/LectureItem";

export default function TeacherMainPage() {

    const dummyLectures: TeacherLecture[] = [
        { id: 1, title: '당구 300 6개월 정복기', description: '당구를 입문하려는 분들께 당구의 기본 원리에 대해 설명합니다.', category: 'study', rating: 4.0, status: 'active', studentCount: 128 },
        { id: 2, title: '계절별 코디 속성 과외', description: '코디를 할 줄 모르는 사람, 옷을 뭘 사야할 지 모르는 사람들을 위한 속성 과외입니다.', category: 'study', rating: 4.5, status: 'active', studentCount: 95 },
        { id: 3, title: '방구석에서 미슐랭 투스타 따라잡기', description: '집에서 누구나 간단하게 따라할 수 있는 요리 레시피.', category: 'study', rating: 4.8, status: 'active', studentCount: 203 },
        { id: 4, title: '정보처리기사 실기 대비', description: '정보 처리기사 실기 기출문제집 풀이 및 예상 문제 대방출!', category: 'study', rating: 4.3, status: 'waiting', studentCount: 0 },
        { id: 5, title: '3대 500 잠자기보다 쉽다', description: '포기하지 않고 따라온다면 누구나 3대 500 할 수 있습니다.', category: 'study', rating: 4.6, status: 'waiting', studentCount: 0 },
        { id: 6, title: '초보자를 위한 피아노 레슨', description: '악보를 못 봐도 괜찮습니다. 처음부터 차근차근 알려드립니다.', category: 'study', rating: 0, status: 'hold', studentCount: 0 },
    ];

    return (
        <div className="m-12 flex flex-col gap-4">
            <div className="flex flex-row items-center">
                <p className="font-bold text-2xl">강사 대시보드</p>
                <div className="flex-1"></div>
                <Button
                    className="rounded-sm p-6 cursor-pointer"
                    type='button'
                >
                    <Link href='/teacher/lectures/create' className="flex flex-row gap-2 items-center">
                        <Plus />
                        강의 등록
                    </Link>
                </Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
                <div className="border border-slate-900 p-4 flex flex-row gap-2 items-center rounded-lg bg-mauve-300 ">
                    <div className="p-2">
                        <BookOpenText className="w-8 h-8" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="font-bold text-2xl">{dummyLectures.length}</p>
                        <p className="text-lg">등록된 강의</p>
                    </div>
                </div>
                <div className="border border-slate-900 p-4 flex flex-row gap-2 items-center rounded-lg bg-mauve-300 ">
                    <div className="p-2">
                        <Users className="w-8 h-8" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="font-bold text-2xl">{dummyLectures[2].studentCount.toLocaleString()}</p>
                        <p className="text-lg">수강생 수</p>
                    </div>
                </div>
                <div className="border border-slate-900 p-4 flex flex-row gap-2 items-center rounded-lg bg-mauve-300 ">
                    <div className="p-2">
                        <Star className="w-8 h-8" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="font-bold text-2xl">{dummyLectures[0].rating.toFixed(1)}</p>
                        <p className="text-lg">평균 평점</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <p>내 강의 목록</p>
                <div>
                    {/* <LectureItem key={dummyLectures[0].id} role==='student' 'list', , false} /> */}
                </div>
            </div>
            <div>
                최근 들어온 질문
            </div>
        </div>
    );
}