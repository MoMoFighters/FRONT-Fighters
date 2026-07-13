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
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="relative h-75 bg-slate-100">
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
                    className="absolute left-5 top-5 inline-flex h-10 items-center gap-2 rounded-full bg-white/90 px-4 text-xs font-bold text-slate-700 shadow-sm backdrop-blur transition-colors hover:bg-white"
                >
                    <ChevronLeft className="h-4 w-4" />
                    강의 목록
                </Link>

                <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
                        {categoryMeta.label} 강의
                    </span>
                    <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight">
                        {lecture.title}
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-white/80">
                        {lecture.description}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-3 divide-x divide-slate-100 px-7 py-5">
                <div>
                    <p className="text-xs font-bold text-slate-400">
                        평점
                    </p>
                    <p className="mt-2 flex items-center gap-1.5 text-sm font-bold text-slate-900">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        {lecture.averageRating ?? 0}
                        <span className="font-medium text-slate-400">/ 5.0</span>
                    </p>
                </div>

                <div className="px-6">
                    <p className="text-xs font-bold text-slate-400">
                        커리큘럼
                    </p>
                    <p className="mt-2 text-sm font-bold text-slate-900">
                        총 {chapterCount}개 챕터
                    </p>
                </div>

                <div className="px-6">
                    <p className="text-xs font-bold text-slate-400">
                        예상 학습 시간
                    </p>
                    <p className="mt-2 flex items-center gap-1.5 text-sm font-bold text-slate-900">
                        <Clock3 className="h-4 w-4 text-indigo-400" />
                        {formatTotalDuration(totalDurationSec)}
                    </p>
                </div>
            </div>
        </section>
    );
}
