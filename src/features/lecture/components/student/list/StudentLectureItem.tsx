import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { Lecture } from "@/features/lecture/type";

interface StudentLectureItemProps {
    lecture: Lecture;
    href: string;
    categoryLabel: string;
    buildingImage: StaticImageData;
    progress?: number;
    chapterCount?: number;
    reviewCount?: number;
    showLearningStatus?: boolean;
}

export default function StudentLectureItem({
    lecture,
    href,
    categoryLabel,
    buildingImage,
    progress = 0,
    chapterCount = 12,
    reviewCount = 133,
    showLearningStatus = true,
}: StudentLectureItemProps) {
    return (
        <Link
            href={href}
            className="
                group grid grid-cols-[184px_minmax(0,1fr)_160px]
                items-center gap-6 border-b border-slate-100
                p-4 transition
                last:border-b-0
                hover:bg-slate-50
            "
        >
            <div className="relative h-28 overflow-hidden rounded-xl bg-slate-100">
                <Image
                    src={lecture.thumbnailUrl || buildingImage}
                    alt={lecture.title}
                    fill
                    sizes="184px"
                    className="object-cover"
                />
            </div>

            <div className="flex h-full min-w-0 flex-col">
                <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-500">
                        {categoryLabel}
                    </span>
                </div>

                <h2 className="truncate text-lg font-bold text-slate-700">
                    {lecture.title}
                </h2>

                <p className="mt-1 line-clamp-1 text-sm font-medium text-slate-400">
                    {lecture.description}
                </p>

                {showLearningStatus && (
                    <div className="mt-auto flex items-center gap-3 text-xs font-semibold text-slate-400">
                        <Progress
                            value={progress}
                            id={`lecture-progress-${lecture.lectureId}`}
                            className="max-w-40"
                        />

                        <span>진도율 {progress}%</span>
                        <span>총 {chapterCount}강</span>
                    </div>
                )}
            </div>

            <div className="flex h-full flex-col items-end justify-between">
                <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {lecture.averageRating ?? 0}
                    <span className="font-medium text-slate-400">
                        / 5.0
                    </span>
                    ({reviewCount})
                </div>

                {showLearningStatus && (
                    <span
                        className={`
                            rounded-lg border px-3 py-1.5
                            text-sm font-bold
                            ${lecture.isEnrolled
                                ? "border-indigo-300 text-indigo-500"
                                : "border-slate-300 text-slate-500"
                            }
                        `}
                    >
                        {lecture.isEnrolled ? "학습 중" : "미시청"}
                    </span>
                )}
            </div>
        </Link>
    );
}
