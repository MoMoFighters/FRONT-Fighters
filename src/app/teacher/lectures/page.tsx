import { SearchX } from "lucide-react";

import { getLecturesWithAuth } from "@/app/services/lecture/service";
import LectureItem from "@/components/common/LectureItem";
import { Lecture } from "@/features/lecture/type";

export default async function TeacherLectureList() {
    const responseData = await getLecturesWithAuth({});
    const lectures = responseData.content;

    const activeLectures: Lecture[] = lectures.filter(
        (lecture) => lecture.lectureStatus === "ACTIVE",
    );
    const waitingLectures: Lecture[] = lectures.filter(
        (lecture) => lecture.lectureStatus === "WAITING",
    );
    const holdLectures: Lecture[] = lectures.filter(
        (lecture) => lecture.lectureStatus === "HOLD",
    );

    return (
        <div className="p-12 w-full ">
            <div className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900">내 강의</h2>
            </div>

            <div className="relative grid min-h-0 flex-1 grid-cols-3 gap-6">
                <LectureColumn
                    title="진행중"
                    colorClassName="bg-emerald-400"
                    lectures={activeLectures}
                    emptyMessage="진행 중인 강의가 존재하지 않습니다."
                />

                <LectureColumn
                    title="승인 대기"
                    colorClassName="bg-amber-400"
                    lectures={waitingLectures}
                    emptyMessage="승인 대기중인 강의가 존재하지 않습니다."
                />

                <LectureColumn
                    title="승인 거절"
                    colorClassName="bg-red-400"
                    lectures={holdLectures}
                    emptyMessage="승인 거절된 강의가 존재하지 않습니다."
                />
            </div>
        </div>
    );
}

function LectureColumn({
    title,
    colorClassName,
    lectures,
    emptyMessage,
}: {
    title: string;
    colorClassName: string;
    lectures: Lecture[];
    emptyMessage: string;
}) {
    return (
        <div className="flex max-h-150 min-h-150 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className={`${colorClassName} px-6 py-4`}>
                <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                    <div className="h-2 w-2 rounded-full bg-white" />
                    {title}
                    <span className="ml-auto text-[12px] font-normal">
                        ({lectures.length})
                    </span>
                </h3>
            </div>

            <div className="scrollbar-none flex-1 space-y-3 overflow-y-auto p-4">
                {lectures.length === 0 && (
                    <div className="flex h-full flex-col items-center justify-center text-sm font-medium text-slate-400">
                        <SearchX className="h-8 w-8 text-slate-300" />
                        {emptyMessage}
                    </div>
                )}

                {lectures.map((lecture) => (
                    <LectureItem
                        key={lecture.lectureId}
                        role="teacher"
                        mode="teacherList"
                        lecture={lecture}
                        href={`/teacher/lectures/${lecture.lectureId}`}
                    />
                ))}
            </div>
        </div>
    );
}
