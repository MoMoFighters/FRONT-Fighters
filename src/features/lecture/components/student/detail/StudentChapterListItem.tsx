import Link from "next/link";
import { CheckCircle2, LockKeyhole, PlayCircle } from "lucide-react";

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
    const minutes = Math.floor(durationSec / 60);
    const seconds = durationSec % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export default function StudentChapterListItem({
    category,
    lectureId,
    chapter,
    isEnrolled,
    href,
}: StudentChapterListItemProps) {
    const isLocked =
        isEnrolled !== true ||
        chapter.isAccessible !== true;
    const progress = chapter.chapterProgress ?? 0;
    const chapterHref = href ?? `/student/${category}/lectures/${lectureId}/chapters/${chapter.chapterId}`;

    const content = (
        <>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                {isLocked ? (
                    <LockKeyhole className="h-5 w-5" />
                ) : chapter.isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-indigo-500" />
                ) : (
                    <PlayCircle className="h-5 w-5 text-indigo-500" />
                )}
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-950">
                        Chapter {chapter.orderNo}.
                    </span>

                    {chapter.isCompleted && (
                        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-500">
                            완료
                        </span>
                    )}
                </div>

                <p className="mt-1 truncate text-sm font-medium text-slate-500">
                    {chapter.title}
                </p>
            </div>

            <div className="flex w-56 items-center gap-3">
                <Progress value={progress} />
                <span className="w-9 text-right text-xs font-semibold text-slate-400">
                    {progress}%
                </span>
            </div>

            <span className="w-14 text-right text-sm font-semibold text-slate-400">
                {formatDuration(chapter.durationSec)}
            </span>
        </>
    );

    if (isLocked) {
        return (
            <div className="flex items-center gap-4 bg-slate-50/70 p-5 text-slate-400">
                {content}
            </div>
        );
    }

    return (
        <Link
            href={chapterHref}
            className="flex items-center gap-4 p-5 transition hover:bg-slate-50"
        >
            {content}
        </Link>
    );
}
