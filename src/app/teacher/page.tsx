import { Button } from "@/components/ui/button";
import { BookOpenText, Plus, Star, Users } from "lucide-react";
import Link from "next/link";
import LectureItem from "@/components/common/LectureItem";
import { Lecture } from "@/features/lecture/type";
import { getLectures } from "../services/lecture/service";

export default async function TeacherMainPage() {

    const Lectures = await getLectures({})
    const dummyLectures = Lectures.content.filter((item) => item.lectureStatus === "ACTIVE") as Lecture[];

    console.log(dummyLectures);

    return (
        <div className="m-12 flex flex-col gap-4">
            <div className="flex flex-row items-center">
                <p className="font-bold text-2xl">강사 대시보드</p>
                <div className="flex-1"></div>
                <Button
                    className="px-5 py-5 bg-blue-400 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors cursor-pointer"
                >
                    <Link href={"/teacher/lectures/create"}>
                        + 강의 등록
                    </Link>
                </Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
                <div className="p-4 flex flex-row gap-2 items-center rounded-lg bg-indigo-200 ">
                    <div className="p-2">
                        <BookOpenText className="w-8 h-8" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="font-bold text-2xl">{dummyLectures.length}</p>
                        <p className="text-lg">등록된 강의</p>
                    </div>
                </div>
                <div className="p-4 flex flex-row gap-2 items-center rounded-lg bg-indigo-200 ">
                    <div className="p-2">
                        <Users className="w-8 h-8" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="font-bold text-2xl">0</p>
                        <p className="text-lg">수강생 수</p>
                    </div>
                </div>
                <div className="p-4 flex flex-row gap-2 items-center rounded-lg bg-indigo-200 ">
                    <div className="p-2">
                        <Star className="w-8 h-8" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="font-bold text-2xl">{dummyLectures[0]?.averageRating.toFixed(1) || 0}</p>
                        <p className="text-lg">평균 평점</p>
                    </div>
                </div>
            </div>
            <p className="text-xl font-semibold mt-3">📖 진행중인 강의</p>
            <div className="flex flex-col max-h-100 overflow-y-auto scrollbar-none gap-2 rounded-md bg-indigo-50 p-4">
                <div className="flex-1 flex flex-col gap-2">
                    {dummyLectures.length > 0 ? dummyLectures.map(lecture =>
                        <LectureItem key={lecture.id} lecture={lecture} role='teacher' mode='teacherList' href={`/teacher/lectures/${lecture.id}`} />
                    ) : <div className="mx-auto my-auto text-md text-slate-500 font-medium">
                        아직 진행중인 강의가 존재하지 않습니다.
                    </div>}
                </div>
            </div>
            <p className="text-xl font-semibold mt-3">❓ 최근 들어온 질문</p>
            <div className="min-h-80 flex items-center justify-center bg-indigo-50 rounded-md">
                <p className="text-md font-medium text-slate-500">최근에 들어온 질문이 없습니다.</p>
            </div>
        </div>
    );
}