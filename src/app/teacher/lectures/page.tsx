import { getLectures } from "@/app/services/lecture/service";
import LectureItem from "@/components/common/LectureItem";
import { Button } from "@/components/ui/button";
import { Lecture } from "@/features/lecture/type";
import { SearchX } from "lucide-react";
import Link from "next/link";

export default async function TeacherLectureList() {

    const responseData = await getLectures({});
    const lectures = responseData.content;

    const activeLectures: Lecture[] = lectures.filter((lecture) => lecture.lectureStatus === "ACTIVE");
    const waitingLectures: Lecture[] = lectures.filter((lecture) => lecture.lectureStatus === "WAITING");
    const holdLectures: Lecture[] = lectures.filter((lecture) => lecture.lectureStatus === "HOLD");

    return (
        <div className="p-12">
            <div className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900">내 강의</h2>
            </div>

            <div className="grid grid-cols-3 gap-6 flex-1 min-h-0 relative">
                <div className="absolute -top-12 right-0">
                    <Button
                        className="px-5 py-5 bg-blue-400 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                        <Link href={"/teacher/lectures/create"}>
                            + 강의 등록
                        </Link>
                    </Button>
                </div>

                <div className="bg-white min-h-150 max-h-150 rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    <div className="bg-emerald-400 px-6 py-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            진행중
                            <span className="ml-auto text-[12px] font-normal">({activeLectures.length})</span>
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto scrollbar-none p-4 space-y-3">
                        {activeLectures.length === 0 && (
                            <div className="h-full flex flex-col justify-center items-center text-slate-400 text-sm font-mediaum">
                                <SearchX className="w-8 h-8 text-slate-300"
                                />
                                진행 중인 강의가 존재하지 않습니다.
                            </div>
                        )}
                        {activeLectures.map((lecture) => (
                            <LectureItem key={lecture.id} role="teacher" mode="teacherList" lecture={lecture} href={`/teacher/lectures/${lecture.id}`} />
                        ))}
                    </div>
                </div>

                <div className="bg-white min-h-150 max-h-150 rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    <div className="bg-amber-400 px-6 py-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <div className="w-2 h-2 bg-white rounded-full" />
                            승인 대기
                            <span className="ml-auto text-[12px] font-normal">({waitingLectures.length})</span>
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto scrollbar-none p-4 space-y-3">
                        {waitingLectures.length === 0 && (
                            <div className="h-full flex flex-col justify-center items-center text-slate-400 text-sm font-mediaum">
                                <SearchX className="w-8 h-8 text-slate-300"
                                />
                                승인 대기중인 강의가 존재하지 않습니다.
                            </div>
                        )}
                        {waitingLectures.map((lecture) => (
                            <LectureItem key={lecture.id} role="teacher" mode="teacherList" lecture={lecture} href={`/teacher/lectures/${lecture.id}`} />
                        ))}
                    </div>
                </div>

                <div className="bg-white min-h-150 max-h-150 rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    <div className="bg-red-400 px-6 py-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <div className="w-2 h-2 bg-white rounded-full" />
                            승인 거절
                            <span className="ml-auto text-[12px] font-normal">({holdLectures.length})</span>
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto scrollbar-none p-4 space-y-3">
                        {holdLectures.length === 0 && (
                            <div className="h-full flex flex-col justify-center items-center text-slate-400 text-sm font-mediaum">
                                <SearchX className="w-8 h-8 text-slate-300"
                                />
                                승인 거절된 강의가 존재하지 않습니다.
                            </div>
                        )}
                        {holdLectures.map((lecture) => (
                            <LectureItem key={lecture.id} role="teacher" mode="teacherList" lecture={lecture} href={`/teacher/lectures/${lecture.id}`} />
                        ))}

                    </div>
                </div>
            </div>
        </div>
    )
};