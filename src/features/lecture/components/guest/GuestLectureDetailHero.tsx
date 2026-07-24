import Image from "next/image";
import Link from "next/link";
import { BookOpen, ChevronLeft, Clock3, Star } from "lucide-react";

import getCategoryMeta from "@/features/lecture/components/student/shared/category";
import { LectureDetailResponse } from "@/features/lecture/type";

interface GuestLectureDetailHeroProps {
    lecture: LectureDetailResponse;
}

const formatTotalDuration = (durationSec: number) => {
    if (durationSec <= 0) {
        return "시간 정보 준비 중";
    }

    const totalMinutes = Math.ceil(durationSec / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) {
        return `${minutes}분`;
    }

    return minutes === 0
        ? `${hours}시간`
        : `${hours}시간 ${minutes}분`;
};

export default function GuestLectureDetailHero({
    lecture,
}: GuestLectureDetailHeroProps) {
    const categoryMeta = getCategoryMeta(lecture.category);
    const chapterCount = lecture.chapters.length;
    const totalDurationSec = lecture.chapters.reduce(
        (sum, chapter) => sum + (chapter.durationSec ?? 0),
        0,
    );

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm [container-type:inline-size]">
            <div className="relative aspect-[4/3] bg-slate-100 sm:aspect-[16/9] md:aspect-[2.8/1]">
                {lecture.thumbnailUrl ? (
                    <Image
                        src={lecture.thumbnailUrl}
                        alt={lecture.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 900px"
                        quality={78}
                        priority
                        className="object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-300">
                        <BookOpen className="h-16 w-16" />
                    </div>
                )}

                <div className="absolute inset-0 bg-linear-to-t from-slate-950/75 via-slate-950/20 to-transparent" />

                <Link
                    href="/lectures"
                    className="absolute left-[3cqw] top-[3cqw] inline-flex h-[clamp(1.75rem,6cqw,2.5rem)] items-center gap-[clamp(0.25rem,1cqw,0.375rem)] rounded-full bg-white/90 px-[clamp(0.5rem,2.5cqw,1rem)] text-[clamp(0.75rem,1.6cqw,0.75rem)] font-bold text-slate-700 shadow-sm backdrop-blur transition-colors hover:bg-white"
                >
                    <ChevronLeft className="h-[clamp(0.75rem,2.5cqw,1rem)] w-[clamp(0.75rem,2.5cqw,1rem)]" />
                    강의 목록
                </Link>

                <div className="absolute inset-x-0 bottom-0 p-[4cqw] text-white">
                    <span className="rounded-full bg-white/15 px-[clamp(0.5rem,2cqw,0.75rem)] py-[clamp(0.2rem,0.8cqw,0.25rem)] text-[clamp(0.75rem,1.4cqw,0.75rem)] font-bold backdrop-blur">
                        {categoryMeta.label} 강의
                    </span>
                    <h1 className="mt-[1.5cqw] max-w-3xl text-[clamp(1.125rem,4cqw,2.25rem)] font-bold tracking-tight">
                        {lecture.title}
                    </h1>
                    <p className="mt-[1cqw] max-w-2xl text-[clamp(0.8125rem,1.6cqw,0.875rem)] font-medium leading-6 text-white/80">
                        {lecture.description}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-3 divide-x divide-slate-100 p-[4cqw]">
                <div>
                    <p className="text-[clamp(0.75rem,1.4cqw,0.75rem)] font-bold text-slate-400">
                        평점
                    </p>
                    <p className="mt-[0.6cqw] flex items-center gap-[0.6cqw] text-[clamp(0.8125rem,1.6cqw,0.875rem)] font-bold text-slate-900">
                        <Star className="h-[clamp(0.75rem,2cqw,1rem)] w-[clamp(0.75rem,2cqw,1rem)] fill-amber-400 text-amber-400" />
                        {lecture.averageRating ?? 0}
                        <span className="font-medium text-slate-400">/ 5.0</span>
                    </p>
                </div>

                <div className="px-[2.5cqw]">
                    <p className="text-[clamp(0.75rem,1.4cqw,0.75rem)] font-bold text-slate-400">
                        커리큘럼
                    </p>
                    <p className="mt-[0.6cqw] text-[clamp(0.8125rem,1.6cqw,0.875rem)] font-bold text-slate-900">
                        총 {chapterCount}개 챕터
                    </p>
                </div>

                <div className="px-[2.5cqw]">
                    <p className="text-[clamp(0.75rem,1.4cqw,0.75rem)] font-bold text-slate-400">
                        예상 학습 시간
                    </p>
                    <p className="mt-[0.6cqw] flex items-center gap-[0.6cqw] text-[clamp(0.8125rem,1.6cqw,0.875rem)] font-bold text-slate-900">
                        <Clock3 className="h-[clamp(0.75rem,2cqw,1rem)] w-[clamp(0.75rem,2cqw,1rem)] text-indigo-400" />
                        {formatTotalDuration(totalDurationSec)}
                    </p>
                </div>
            </div>
        </section>
    );
}
