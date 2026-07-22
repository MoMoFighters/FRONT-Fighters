import { AlertCircle, BookOpenText, CheckCircle2, Clock3, SearchX } from "lucide-react";

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
    const lectureSections = [
        {
            title: "진행중",
            description: "현재 수강생에게 공개된 강의",
            icon: CheckCircle2,
            tone: "emerald",
            lectures: activeLectures,
            emptyMessage: "진행 중인 강의가 존재하지 않습니다.",
        },
        {
            title: "승인 대기",
            description: "관리자 검수를 기다리는 강의",
            icon: Clock3,
            tone: "amber",
            lectures: waitingLectures,
            emptyMessage: "승인 대기중인 강의가 존재하지 않습니다.",
        },
        {
            title: "승인 거절",
            description: "수정 후 다시 제출할 수 있는 강의",
            icon: AlertCircle,
            tone: "rose",
            lectures: holdLectures,
            emptyMessage: "승인 거절된 강의가 존재하지 않습니다.",
        },
    ] as const;

    return (
        <div className="flex h-full min-h-0 w-full flex-col overflow-hidden p-4 sm:p-8">
            <section className="mb-5 shrink-0 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col items-start gap-6 sm:flex-row sm:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-500 ring-1 ring-indigo-100">
                            <BookOpenText className="h-3.5 w-3.5" />
                            Lecture Management
                        </div>
                        <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-950">
                            내 강의
                        </h1>
                        <p className="mt-2 text-sm font-bold text-slate-500">
                            등록한 강의를 상태별로 확인하고 관리할 수 있습니다.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 overflow-hidden rounded-3xl border border-slate-100 bg-slate-50/80">
                        {lectureSections.map((section) => (
                            <div
                                key={section.title}
                                className="min-w-30 border-r border-slate-100 px-5 py-3 last:border-r-0"
                            >
                                <p className="text-[11px] font-black text-slate-400">
                                    {section.title}
                                </p>
                                <p className="mt-1 text-2xl font-black text-slate-950">
                                    {section.lectures.length}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-hidden overflow-y-auto sm:grid-cols-3 sm:overflow-hidden">
                {lectureSections.map((section) => (
                    <LectureColumn
                        key={section.title}
                        title={section.title}
                        description={section.description}
                        icon={section.icon}
                        tone={section.tone}
                        lectures={section.lectures}
                        emptyMessage={section.emptyMessage}
                    />
                ))}
            </div>
        </div>
    );
}

function LectureColumn({
    title,
    description,
    icon: Icon,
    tone,
    lectures,
    emptyMessage,
}: {
    title: string;
    description: string;
    icon: typeof CheckCircle2;
    tone: "emerald" | "amber" | "rose";
    lectures: Lecture[];
    emptyMessage: string;
}) {
    const toneClassName =
        tone === "emerald"
            ? "bg-emerald-50 text-emerald-500 ring-emerald-100"
            : tone === "amber"
                ? "bg-amber-50 text-amber-500 ring-amber-100"
                : "bg-rose-50 text-rose-500 ring-rose-100";

    return (
        <div className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-sm ring-1 ring-slate-100">
            <div className="shrink-0 border-b border-slate-100 px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <h2 className="text-base font-black text-slate-950">
                            {title}
                        </h2>
                        <p className="mt-1 text-xs font-bold text-slate-400">
                            {description}
                        </p>
                    </div>

                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ring-1 ${toneClassName}`}>
                        <Icon className="h-4.5 w-4.5" />
                    </div>
                </div>
            </div>

            <div className="scrollbar-none min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-50/60 p-4">
                {lectures.length === 0 && (
                    <div className="flex h-full min-h-60 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white text-center">
                        <SearchX className="h-9 w-9 text-slate-300" />
                        <p className="mt-3 text-sm font-black text-slate-400">
                            {emptyMessage}
                        </p>
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
