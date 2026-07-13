import Link from "next/link";
import {
    ArrowRight,
    BookOpenText,
    CheckCircle2,
    Clock3,
    HelpCircle,
    LayoutDashboard,
    Plus,
    Star,
    Users,
} from "lucide-react";

import LectureItem from "@/components/common/LectureItem";
import { Lecture } from "@/features/lecture/type";
import { getLecturesWithAuth } from "../services/lecture/service";

export default async function TeacherMainPage() {
    const lectures = await getLecturesWithAuth({});
    const teacherLectures = lectures.content as Lecture[];
    const activeLectures = teacherLectures.filter(
        (item) => item.lectureStatus === "ACTIVE"
    );
    const waitingLectures = teacherLectures.filter(
        (item) => item.lectureStatus === "WAITING"
    );
    const holdLectures = teacherLectures.filter(
        (item) => item.lectureStatus === "HOLD"
    );
    const averageRating =
        activeLectures.length > 0
            ? activeLectures.reduce(
                (sum, lecture) => sum + (lecture.averageRating ?? 0),
                0
            ) / activeLectures.length
            : 0;

    const metrics = [
        {
            title: "진행중인 강의",
            value: activeLectures.length.toLocaleString(),
            description: "현재 수강 가능한 강의",
            icon: BookOpenText,
            tone: "indigo",
        },
        {
            title: "승인 대기",
            value: waitingLectures.length.toLocaleString(),
            description: "관리자 검수 대기중",
            icon: Clock3,
            tone: "amber",
        },
        {
            title: "수강생 수",
            value: "0",
            description: "추후 집계 API 연결 예정",
            icon: Users,
            tone: "emerald",
        },
        {
            title: "평균 평점",
            value: averageRating.toFixed(1),
            description: `${activeLectures.length}개 강의 기준`,
            icon: Star,
            tone: "rose",
        },
    ] as const;

    const questions = [
        {
            id: 1,
            title: "챕터 영상 자료는 어디에서 확인하나요?",
            lectureTitle: "오늘 요리 수업 후기",
            createdAt: "2026-06-17 10:24",
            status: "대기",
        },
        {
            id: 2,
            title: "강의 수강 전 준비물이 궁금합니다.",
            lectureTitle: "헬스 초보 루틴",
            createdAt: "2026-06-17 09:12",
            status: "대기",
        },
        {
            id: 3,
            title: "과제 제출은 어떤 방식인가요?",
            lectureTitle: "집중 잘 되는 공부법",
            createdAt: "2026-06-16 18:40",
            status: "완료",
        },
    ];

    return (
        <main className="mx-auto w-full max-w-360 px-12 py-10">
            <section className="relative overflow-hidden rounded-4xl border border-slate-200 bg-white p-8 text-slate-950 shadow-sm">

                <div className="relative flex items-start justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-500 ring-1 ring-indigo-100">
                            <LayoutDashboard className="h-3.5 w-3.5" />
                            Teacher Dashboard
                        </div>

                        <h1 className="mt-5 text-3xl font-black tracking-tight">
                            강사 대시보드
                        </h1>
                        <p className="mt-3 max-w-160 text-sm font-bold leading-6 text-slate-500">
                            등록한 강의 현황과 수강생 질문을 한눈에 확인하고,
                            새로운 강의를 빠르게 개설할 수 있습니다.
                        </p>
                    </div>
                </div>
            </section>

            <section className="mt-6 grid grid-cols-4 gap-4">
                {metrics.map((metric) => (
                    <div
                        key={metric.title}
                        className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-black text-slate-500">
                                    {metric.title}
                                </p>
                                <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                                    {metric.value}
                                </p>
                            </div>

                            <div
                                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${metric.tone === "indigo"
                                    ? "bg-indigo-50 text-indigo-500"
                                    : metric.tone === "amber"
                                        ? "bg-amber-50 text-amber-500"
                                        : metric.tone === "emerald"
                                            ? "bg-emerald-50 text-emerald-500"
                                            : "bg-rose-50 text-rose-500"
                                    }`}
                            >
                                <metric.icon className="h-5 w-5" />
                            </div>
                        </div>

                        <p className="mt-3 text-xs font-bold text-slate-400">
                            {metric.description}
                        </p>
                    </div>
                ))}
            </section>

            <section className="mt-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-black text-slate-950">
                                현재 진행중인 강의
                            </h2>
                            <p className="mt-1 text-xs font-bold text-slate-400">
                                활성화된 강의를 최신순으로 확인하세요.
                            </p>
                        </div>

                        <Link
                            href="/teacher/lectures"
                            className="flex items-center gap-1 text-xs font-black text-indigo-500 transition hover:text-indigo-600"
                        >
                            전체보기
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    <div className="max-h-110 space-y-2 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center">
                                <BookOpenText className="h-10 w-10 text-slate-300" />
                                <p className="mt-3 text-sm font-black text-slate-500">
                                    아직 진행중인 강의가 없습니다.
                                </p>
                                <Link
                                    href="/teacher/lectures/create"
                                    className="mt-4 rounded-full bg-indigo-500 px-4 py-2 text-xs font-black text-white transition hover:bg-indigo-600"
                                >
                                    첫 강의 등록하기
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

            </section>
        </main>
    );
}
