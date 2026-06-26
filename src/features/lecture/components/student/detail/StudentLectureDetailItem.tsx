import Image from "next/image";
import { Star } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import EnrollLectureBtn from "@/features/lecture/components/buttons/EnrollLectureBtn";
import { LectureDetailResponse } from "@/features/lecture/type";

interface StudentLectureDetailItemProps {
    lecture: LectureDetailResponse;
    category: string;
    categoryLabel: string;
    position?: string;
    resumeChapterId?: number;
    chapterBaseHref?: string;
}

export default function StudentLectureDetailItem({
    lecture,
    category,
    categoryLabel,
    position,
}: StudentLectureDetailItemProps) {
    const progress = lecture.lectureProgress ?? 0;
    const chapterCount = lecture.chapters.length;

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid grid-cols-[320px_minmax(0,1fr)] gap-8">
                <div className="relative h-56 overflow-hidden rounded-xl bg-slate-100">
                    {lecture.thumbnailUrl && (
                        <Image
                            src={lecture.thumbnailUrl}
                            alt={lecture.title}
                            fill
                            sizes="320px"
                            className="object-cover"
                        />
                    )}
                </div>

                <div className="flex min-w-0 flex-col">
                    <span className="w-fit rounded-full bg-indigo-50 px-3 py-1 text-sm font-bold text-indigo-500">
                        {categoryLabel} 강의
                    </span>

                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
                        {lecture.title}
                    </h2>

                    <p className="mt-3 line-clamp-2 text-sm font-medium leading-6 text-slate-500">
                        {lecture.description}
                    </p>

                    <div className="mt-6 flex items-center gap-4 text-sm font-semibold text-slate-500">
                        <span className="flex items-center gap-1.5 text-slate-700">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            {lecture.averageRating ?? 0}
                            <span className="font-medium text-slate-400">
                                / 5.0
                            </span>
                        </span>

                        <span>총 {chapterCount}개 챕터</span>

                        <span>
                            {lecture.isEnrolled
                                ? lecture.isCompleted
                                    ? "학습 완료"
                                    : "학습 중"
                                : "수강 전"}
                        </span>
                    </div>

                    <div className="mt-auto border-t border-slate-100 pt-5">
                        {lecture.isEnrolled ? (
                            <div className="flex items-center gap-5">
                                <span className="text-sm font-bold text-indigo-500">
                                    {lecture.isCompleted ? "학습 완료" : "학습 중"}
                                </span>

                                <Progress value={progress} className="max-w-48" />

                                <span className="text-sm font-semibold text-slate-500">
                                    진도율 {progress}%
                                </span>

                            </div>
                        ) : (
                            <div className="flex justify-end">
                                <EnrollLectureBtn
                                    lectureId={lecture.lectureId}
                                    category={category}
                                    position={position}
                                    className="h-11 rounded-xl bg-indigo-500 px-5 text-sm font-bold text-white transition hover:bg-indigo-600"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
