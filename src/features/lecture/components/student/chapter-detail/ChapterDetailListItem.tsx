import Link from "next/link";
import { CheckCircle2, LockKeyhole, PlayCircle } from "lucide-react";

import { Chapter } from "@/features/lecture/type";

interface ChapterDetailListItemProps {
    category: string;
    lectureId: string;
    chapter: Chapter;
    isActive: boolean;
    href?: string;
}

const formatDuration = (durationSec: number) => {
    const minutes = Math.floor(durationSec / 60);
    const seconds = durationSec % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export default function ChapterDetailListItem({
    category,
    lectureId,
    chapter,
    isActive,
    href,
}: ChapterDetailListItemProps) {
    const isLocked = chapter.isAccessible === false;
    const chapterHref = href ?? `/student/${category}/lectures/${lectureId}/chapters/${chapter.chapterId}`;

    const content = (
        <>
            <div
                className={`
                    flex h-10 w-10 shrink-0 items-center justify-center rounded-full
                    ${isActive
                        ? "bg-indigo-500 text-white"
                        : "bg-slate-100 text-slate-400"
                    }
                `}
            >
                {isLocked ? (
                    <LockKeyhole className="h-4 w-4" />
                ) : chapter.isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                    <PlayCircle className="h-4 w-4" />
                )}
            </div>

            <div className="min-w-0 flex-1">
                <p
                    className={`
                        text-sm font-bold
                        ${isActive ? "text-indigo-500" : "text-slate-950"}
                    `}
                >
                    Chapter {chapter.orderNo}.
                </p>

                <p className="mt-1 truncate text-sm font-medium text-slate-500">
                    {chapter.title}
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-400">
                    {formatDuration(chapter.durationSec)}
                </p>
            </div>

            <span className="text-xs font-bold text-slate-400">
                {isLocked
                    ? "잠김"
                    : chapter.isCompleted
                        ? "완료"
                        : isActive
                            ? "학습 중"
                            : ""}
            </span>
        </>
    );

    if (isLocked) {
        return (
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 opacity-70">
                {content}
            </div>
        );
    }

    return (
        <Link
            href={chapterHref}
            className={`
                flex items-center gap-3 rounded-xl border p-4 transition
                ${isActive
                    ? "border-indigo-300 bg-indigo-50"
                    : "border-slate-100 bg-white hover:border-indigo-200 hover:bg-indigo-50"
                }
            `}
        >
            {content}
        </Link>
    );
}
