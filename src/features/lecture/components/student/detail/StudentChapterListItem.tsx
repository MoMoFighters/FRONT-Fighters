import Image from "next/image";
import Link from "next/link";
import { BookOpen, LockKeyhole } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { Chapter } from "@/features/lecture/type";

interface StudentChapterListItemProps {
    category: string;
    lectureId: string;
    chapter: Chapter;
    isEnrolled?: boolean;
    href?: string;
}

const formatDuration = (durationSec: number) => {
    if (!durationSec) {
        return "시간 준비 중";
    }

    const minutes = Math.ceil(durationSec / 60);

    return `${minutes}분`;
};

export default function StudentChapterListItem({
    category,
    lectureId,
    chapter,
    isEnrolled,
    href,
}: StudentChapterListItemProps) {
    const isLocked = isEnrolled !== true || chapter.isAccessible !== true;
    const progress = chapter.chapterProgress ?? 0;
    const chapterHref = href ?? `/student/${category}/lectures/${lectureId}/chapters/${chapter.chapterId}`;

    const content = (
        <article className="grid grid-cols-1 items-center gap-3 px-4 py-4 sm:grid-cols-[112px_minmax(0,1fr)_120px] sm:gap-4 sm:px-5">
            <div className="relative h-14 overflow-hidden rounded-lg bg-slate-100 sm:h-16">
                {chapter.chapterThumbnailUrl ? (
                    <Image
                        src={chapter.chapterThumbnailUrl}
                        alt={chapter.title}
                        fill
                        sizes="112px"
                        quality={70}
                        className={`object-cover ${isLocked ? "opacity-75" : ""}`}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-300">
                        <BookOpen className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                )}

                {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20">
                        <LockKeyhole className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                    </div>
                )}
            </div>

            <div className="min-w-0">
                <div className="flex items-center gap-2">
                    <p className="text-[11px] font-bold text-indigo-400">
                        Chapter {chapter.orderNo}
                    </p>

                    {chapter.isCompleted && (
                        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-500">
                            완료
                        </span>
                    )}
                </div>
                <h3 className="mt-1 truncate text-sm font-bold text-slate-900">
                    {chapter.title}
                </h3>
                <p className="mt-1 text-xs font-medium text-slate-400">
                    {formatDuration(chapter.durationSec)}
                </p>
            </div>

            {!isLocked && (
                <div className="flex items-center gap-2">
                    <Progress value={progress} className="w-full sm:w-16" />
                    <span className="w-9 shrink-0 text-right text-xs font-bold text-slate-400">
                        {progress}%
                    </span>
                </div>
            )}
        </article>
    );

    if (isLocked) {
        return <div className="bg-slate-50/70 text-slate-400">{content}</div>;
    }

    return (
        <Link href={chapterHref} className="block transition hover:bg-slate-50">
            {content}
        </Link>
    );
}
