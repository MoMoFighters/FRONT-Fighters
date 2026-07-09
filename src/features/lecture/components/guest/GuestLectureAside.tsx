import Link from "next/link";
import { BookOpenCheck, GraduationCap, Sparkles } from "lucide-react";

const categoryGuides = [
    "학습",
    "운동",
    "요리",
    "뷰티",
    "예술",
];

export default function GuestLectureAside() {
    return (
        <aside className="sticky top-20 self-start space-y-5">
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500">
                    <GraduationCap className="h-5 w-5" />
                </div>

                <h2 className="text-base font-bold text-slate-950">
                    처음 방문하셨나요?
                </h2>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                    강의는 누구나 둘러볼 수 있습니다. 수강 신청, 학습 기록 저장, 도시 성장은 로그인 후 이용할 수 있습니다.
                </p>

                <Link
                    href="/about"
                    className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-lg bg-indigo-500/90 text-xs font-bold text-white transition-colors hover:bg-indigo-500"
                >
                    사이트 소개 보러가기
                </Link>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <BookOpenCheck className="h-5 w-5" />
                </div>

                <h2 className="text-base font-bold text-slate-950">
                    카테고리별 강의
                </h2>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                    관심 분야를 선택하면 해당 분야의 강의를 빠르게 확인할 수 있습니다.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                    {categoryGuides.map((category) => (
                        <span
                            key={category}
                            className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-500"
                        >
                            {category}
                        </span>
                    ))}
                </div>
            </section>

            <section className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-5">
                <div className="mb-3 flex items-center gap-2 text-xs font-bold text-indigo-500">
                    <Sparkles className="h-4 w-4" />
                    모모시티 학습 경험
                </div>

                <p className="text-xs leading-5 text-indigo-900/70">
                    강의를 수강하면 학습 기록이 쌓이고, 선택한 카테고리에 맞는 도시 건물이 성장합니다.
                </p>
            </section>
        </aside>
    );
}
