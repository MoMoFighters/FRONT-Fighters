import Image from "next/image";
import Link from "next/link";
import { BookOpen, ChevronLeft, Clock3, Star } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import EnrollLectureBtn from "@/features/lecture/components/buttons/EnrollLectureBtn";
import { LectureDetailResponse } from "@/features/lecture/type";
import CreateReportBtn from "@/features/report/components/buttons/CreateReportBtn";
import AskLectureAiButton from "./AskLectureAiButton";
import type { Membership } from "@/features/user/type";

interface StudentLectureDetailItemProps {
    lecture: LectureDetailResponse;
    category: string;
    categoryLabel: string;
    membership: Membership;
    backHref: string;
    position?: string;
    resumeChapterId?: number;
    chapterBaseHref?: string;
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

    return minutes === 0 ? `${hours}시간` : `${hours}시간 ${minutes}분`;
};

export default function StudentLectureDetailItem({
    lecture,
    categoryLabel,
    membership,
    backHref,
    position,
}: StudentLectureDetailItemProps) {
    const progress = lecture.lectureProgress ?? 0;
    const chapterCount = lecture.chapters.length;
    const totalDurationSec = lecture.chapters.reduce(
        (sum, chapter) => sum + (chapter.durationSec ?? 0),
        0,
    );

    return (
        <div className="relative">
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
                        href={backHref}
                        className="absolute left-[3cqw] top-[3cqw] inline-flex h-[clamp(1.75rem,6cqw,2.5rem)] items-center gap-[clamp(0.25rem,1cqw,0.375rem)] rounded-full bg-white/90 px-[clamp(0.5rem,2.5cqw,1rem)] text-[clamp(0.75rem,1.6cqw,0.75rem)] font-bold text-slate-700 shadow-sm backdrop-blur transition-colors hover:bg-white"
                    >
                        <ChevronLeft className="h-[clamp(0.75rem,2.5cqw,1rem)] w-[clamp(0.75rem,2.5cqw,1rem)]" />
                        강의 목록
                    </Link>

                    <CreateReportBtn
                        triggerLabel="강의 신고"
                        triggerClassName="absolute right-[3cqw] top-[3cqw] rounded-full bg-white/90 px-[clamp(0.5rem,2.5cqw,1rem)] py-[clamp(0.3rem,1.2cqw,0.375rem)] text-[clamp(0.75rem,1.6cqw,0.75rem)] font-bold text-slate-700 shadow-sm backdrop-blur transition-colors hover:bg-white"
                        targetType="LECTURE"
                        targetId={lecture.lectureId}
                    />

                    <div className="absolute inset-x-0 bottom-0 p-[4cqw] text-white">
                        <span className="rounded-full bg-white/15 px-[clamp(0.5rem,2cqw,0.75rem)] py-[clamp(0.2rem,0.8cqw,0.25rem)] text-[clamp(0.75rem,1.4cqw,0.75rem)] font-bold backdrop-blur">
                            {categoryLabel} 강의
                        </span>
                        <h1 className="mt-[1.5cqw] max-w-3xl text-[clamp(1.125rem,4cqw,2.25rem)] font-bold tracking-tight">
                            {lecture.title}
                        </h1>
                        <p className="mt-[1cqw] line-clamp-2 max-w-2xl text-[clamp(0.8125rem,1.6cqw,0.875rem)] font-medium leading-6 text-white/80">
                            {lecture.description}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 p-[4cqw] sm:flex sm:items-start sm:justify-between sm:divide-x-0 sm:divide-y-0">
                    <div className="pb-[1.5cqw] pr-[1.5cqw] sm:pb-0 sm:pr-0">
                        <p className="hidden text-[clamp(0.75rem,1.4cqw,0.75rem)] font-bold text-slate-400 md:block">평점</p>
                        <p className="mt-[0.6cqw] flex items-center gap-[0.6cqw] text-[clamp(0.8125rem,1.6cqw,0.875rem)] font-bold text-slate-900">
                            <Star className="h-[clamp(0.75rem,2cqw,1rem)] w-[clamp(0.75rem,2cqw,1rem)] fill-amber-400 text-amber-400" />
                            {lecture.averageRating ?? 0}
                            <span className="hidden font-medium text-slate-400 md:inline">/ 5.0</span>
                        </p>
                    </div>

                    <div className="pb-[1.5cqw] pl-[1.5cqw] sm:pb-0 sm:pl-0">
                        <p className="hidden text-[clamp(0.75rem,1.4cqw,0.75rem)] font-bold text-slate-400 md:block">커리큘럼</p>
                        <p className="mt-[0.6cqw] text-[clamp(0.8125rem,1.6cqw,0.875rem)] font-bold text-slate-900">
                            <span className="md:hidden">{chapterCount}개</span>
                            <span className="hidden md:inline">총 {chapterCount}개 챕터</span>
                        </p>
                    </div>

                    <div className="pt-[1.5cqw] pr-[1.5cqw] sm:pt-0 sm:pr-0">
                        <p className="hidden text-[clamp(0.75rem,1.4cqw,0.75rem)] font-bold text-slate-400 md:block">예상 학습 시간</p>
                        <p className="mt-[0.6cqw] flex items-center gap-[0.6cqw] text-[clamp(0.8125rem,1.6cqw,0.875rem)] font-bold text-slate-900">
                            <Clock3 className="h-[clamp(0.75rem,2cqw,1rem)] w-[clamp(0.75rem,2cqw,1rem)] text-indigo-400" />
                            {formatTotalDuration(totalDurationSec)}
                        </p>
                    </div>

                    <div className="pt-[1.5cqw] pl-[1.5cqw] sm:pt-0 sm:pl-0">
                        <p className="hidden text-[clamp(0.75rem,1.4cqw,0.75rem)] font-bold text-slate-400 md:block">수강 상태</p>

                        {lecture.isEnrolled ? (
                            <div className="mt-[0.6cqw] flex items-center gap-[0.8cqw]">
                                <Progress value={progress} className="hidden md:block md:w-16" />
                                <span className="text-[clamp(0.8125rem,1.6cqw,0.875rem)] font-bold text-slate-900">{progress}%</span>
                            </div>
                        ) : (
                            <div className="mt-[0.6cqw]">
                                <EnrollLectureBtn
                                    lectureId={lecture.lectureId}
                                    membership={membership}
                                    position={position}
                                    className="h-[clamp(1.5rem,6cqw,2rem)] rounded-lg bg-indigo-500 px-[clamp(0.5rem,2.5cqw,0.75rem)] text-[clamp(0.75rem,1.6cqw,0.75rem)] font-bold text-white transition hover:bg-indigo-600"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <AskLectureAiButton
                href={`?bot=true&lectureId=${lecture.lectureId}&title=${encodeURIComponent(lecture.title)}`}
                membership={membership}
            />
        </div>
    );
}
