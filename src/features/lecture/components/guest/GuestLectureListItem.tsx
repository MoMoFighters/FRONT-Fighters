import Image from "next/image";
import Link from "next/link";
import { BookOpen, Star } from "lucide-react";

import getCategoryMeta from "@/features/lecture/components/student/shared/category";
import { Lecture } from "@/features/lecture/type";

interface GuestLectureListItemProps {
    lecture: Lecture;
    priority?: boolean;
}

export default function GuestLectureListItem({
    lecture,
    priority = false,
}: GuestLectureListItemProps) {
    const categoryMeta = getCategoryMeta(lecture.category);
    const chapterCount = lecture.chapterCount ?? lecture.totalChapterCount ?? 0;
    const averageRating = (lecture.averageRating ?? 0).toFixed(1);
    const reviewCount = lecture.reviewCount ?? 0;

    return (
        <Link
            href={`/lectures/${lecture.lectureId}`}
            className="group grid grid-cols-1 items-center gap-3 border-b border-slate-100 px-4 py-3 transition-colors last:border-b-0 hover:bg-slate-50 md:grid-cols-[144px_minmax(0,1fr)] md:gap-5"
        >
            <div className="relative h-21 overflow-hidden rounded-sm bg-slate-100">
                {lecture.thumbnailUrl ? (
                    <Image
                        src={lecture.thumbnailUrl}
                        alt={lecture.title}
                        fill
                        sizes="144px"
                        quality={70}
                        priority={priority}
                        className="object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-300">
                        <BookOpen className="h-9 w-9" />
                    </div>
                )}
            </div>

            <div className="min-w-0">
                <div className="mb-2 flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-2">
                        <span className="rounded-sm bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-500">
                            {categoryMeta.label}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">
                            {chapterCount > 0 ? `${chapterCount}개 챕터` : "챕터 준비 중"}
                        </span>
                    </div>

                    <span className="flex shrink-0 items-center gap-1 text-[11px] font-bold text-slate-700">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {averageRating}
                        <span className="font-medium text-slate-400">/5.0</span>
                        <span className="font-medium text-slate-400">
                            ({reviewCount})
                        </span>
                    </span>
                </div>

                <h3 className="truncate text-sm font-bold text-slate-900 transition-colors group-hover:text-indigo-500">
                    {lecture.title}
                </h3>

                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                    {lecture.description}
                </p>
            </div>
        </Link>
    );
}
