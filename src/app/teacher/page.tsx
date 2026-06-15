import Link from "next/link";
import { BookOpenText, Star, Users } from "lucide-react";

import LectureItem from "@/components/common/LectureItem";
import { Button } from "@/components/ui/button";
import { Lecture } from "@/features/lecture/type";
import { getLectures } from "../services/lecture/service";

export default async function TeacherMainPage() {
    const lectures = await getLectures({});
    const activeLectures = lectures.content.filter(
        (item) => item.lectureStatus === "ACTIVE",
    ) as Lecture[];

    return (
        <div className="m-12 flex flex-col gap-4">
            <div className="flex flex-row items-center">
                <p className="text-2xl font-bold">강사 대시보드</p>
                <div className="flex-1" />
                <Button className="cursor-pointer rounded-lg bg-blue-400 px-5 py-5 font-semibold text-white transition-colors hover:bg-blue-500">
                    <Link href="/teacher/lectures/create">+ 강의 등록</Link>
                </Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-row items-center gap-2 rounded-lg bg-indigo-200 p-4">
                    <div className="p-2">
                        <BookOpenText className="h-8 w-8" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-2xl font-bold">{activeLectures.length}</p>
                        <p className="text-lg">등록한 강의</p>
                    </div>
                </div>

                <div className="flex flex-row items-center gap-2 rounded-lg bg-indigo-200 p-4">
                    <div className="p-2">
                        <Users className="h-8 w-8" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-2xl font-bold">0</p>
                        <p className="text-lg">수강생 수</p>
                    </div>
                </div>

                <div className="flex flex-row items-center gap-2 rounded-lg bg-indigo-200 p-4">
                    <div className="p-2">
                        <Star className="h-8 w-8" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-2xl font-bold">
                            {activeLectures[0]?.averageRating.toFixed(1) || 0}
                        </p>
                        <p className="text-lg">평균 평점</p>
                    </div>
                </div>
            </div>

            <p className="mt-3 text-xl font-semibold">현재 진행중인 강의</p>
            <div className="scrollbar-none flex max-h-100 flex-col gap-2 overflow-y-auto rounded-md bg-indigo-50 p-4">
                <div className="flex flex-1 flex-col gap-2">
                    {activeLectures.length > 0 ? (
                        activeLectures.map((lecture) => (
                            <LectureItem
                                key={lecture.lectureId}
                                lecture={lecture}
                                role="teacher"
                                mode="teacherList"
                                href={`/teacher/lectures/${lecture.lectureId}`}
                            />
                        ))
                    ) : (
                        <div className="mx-auto my-auto text-md font-medium text-slate-500">
                            아직 진행중인 강의가 존재하지 않습니다.
                        </div>
                    )}
                </div>
            </div>

            <p className="mt-3 text-xl font-semibold">최근 들어온 질문</p>
            <div className="flex min-h-80 items-center justify-center rounded-md bg-indigo-50">
                <p className="text-md font-medium text-slate-500">
                    최근 들어온 질문이 없습니다.
                </p>
            </div>
        </div>
    );
}