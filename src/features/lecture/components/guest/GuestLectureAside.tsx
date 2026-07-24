import Link from "next/link";
import { BookOpenCheck, GraduationCap } from "lucide-react";
import GuestInquiryCard from "@/features/guest/components/GuestInquiryCard";

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
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm [container-type:inline-size]">
                <div className="mb-4 flex h-[clamp(2rem,10cqw,2.5rem)] w-[clamp(2rem,10cqw,2.5rem)] items-center justify-center rounded-lg bg-indigo-50 text-indigo-500">
                    <GraduationCap className="h-[clamp(1rem,5cqw,1.25rem)] w-[clamp(1rem,5cqw,1.25rem)]" />
                </div>

                <h2 className="text-[clamp(0.9375rem,4cqw,1rem)] font-bold text-slate-950">
                    처음 방문하셨나요?
                </h2>

                <p className="mt-2 text-[clamp(0.75rem,3cqw,0.75rem)] leading-5 text-slate-500">
                    강의는 누구나 둘러볼 수 있습니다. 수강 신청, 학습 기록 저장, 도시 성장은 로그인 후 이용할 수 있습니다.
                </p>

                <Link
                    href="/about"
                    className="mt-4 flex h-[clamp(2rem,9cqw,2.25rem)] w-full items-center justify-center rounded-lg bg-indigo-500/90 text-[clamp(0.75rem,3cqw,0.75rem)] font-bold text-white transition-colors hover:bg-indigo-500"
                >
                    사이트 소개 보러가기
                </Link>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm [container-type:inline-size]">
                <div className="mb-4 flex h-[clamp(2rem,10cqw,2.5rem)] w-[clamp(2rem,10cqw,2.5rem)] items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <BookOpenCheck className="h-[clamp(1rem,5cqw,1.25rem)] w-[clamp(1rem,5cqw,1.25rem)]" />
                </div>

                <h2 className="text-[clamp(0.9375rem,4cqw,1rem)] font-bold text-slate-950">
                    카테고리별 강의
                </h2>

                <p className="mt-2 text-[clamp(0.75rem,3cqw,0.75rem)] leading-5 text-slate-500">
                    관심 분야를 선택하면 해당 분야의 강의를 빠르게 확인할 수 있습니다.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                    {categoryGuides.map((category) => (
                        <span
                            key={category}
                            className="rounded-full bg-slate-50 px-2.5 py-1 text-[clamp(0.6875rem,2.5cqw,0.6875rem)] font-bold text-slate-500"
                        >
                            {category}
                        </span>
                    ))}
                </div>
            </section>

            <GuestInquiryCard />
        </aside>
    );
}
