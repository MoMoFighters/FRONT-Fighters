import Image from "next/image";
import Link from "next/link";
import { BookOpen, Star } from "lucide-react";

import getCategoryMeta from "@/features/lecture/components/student/shared/category";
import { Lecture } from "@/features/lecture/type";

interface GuestLectureListItemProps {
    lecture: Lecture;
}

export default function GuestLectureListItem({
    lecture,
}: GuestLectureListItemProps) {
    const categoryMeta = getCategoryMeta(lecture.category);
    const chapterCount = lecture.chapterCount ?? lecture.totalChapterCount ?? 0;

    return (
        <Link
            href={`/lectures/${lecture.lectureId}`}
            className="group grid grid-cols-[144px_minmax(0,1fr)_120px] items-center gap-5 border-b border-slate-100 px-4 py-3 transition-colors last:border-b-0 hover:bg-slate-50"
        >
            <div className="relative h-21 overflow-hidden rounded-sm bg-slate-100">
                {lecture.thumbnailUrl ? (
                    <Image
                        src={lecture.thumbnailUrl}
                        alt={lecture.title}
                        fill
                        sizes="144px"
                        quality={70}
                        className="object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-300">
                        <BookOpen className="h-9 w-9" />
                    </div>
                )}
            </div>

            <div className="min-w-0">
                <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-sm bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-500">
                        {categoryMeta.label}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                        {chapterCount > 0 ? `${chapterCount}개 챕터` : "챕터 준비 중"}
                    </span>
                </div>

                <h3 className="truncate text-sm font-bold text-slate-900 transition-colors group-hover:text-indigo-500">
                    {lecture.title}
                </h3>

                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                    {lecture.description}
                </p>
            </div>

            <div className="flex h-full flex-col items-end justify-center gap-1 text-right">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {lecture.averageRating ?? 0}
                    <span className="font-medium text-slate-400">/ 5.0</span>
                </div>
                <span className="text-[11px] font-medium text-slate-400">
                    수강평 {lecture.reviewCount ?? 0}개
                </span>
            </div>
        </Link>
    );
}
