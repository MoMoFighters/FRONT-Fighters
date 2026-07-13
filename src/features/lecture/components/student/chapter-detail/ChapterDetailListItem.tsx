import Image from "next/image";
import Link from "next/link";

import { ChapterByMeta } from "@/features/lecture/type";

interface ChapterDetailListItemProps {
    category: string;
    lectureId: string;
    chapter: ChapterByMeta;
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
    const isLocked = chapter.isAccessible !== true;
    const chapterHref = href ?? `/student/${category}/lectures/${lectureId}/chapters/${chapter.chapterId}`;

    const content = (
        <>
            <div className="relative flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-[10px] font-bold text-slate-400">
                {chapter.chapterThumbnailUrl ? (
                    <Image
                        src={chapter.chapterThumbnailUrl}
                        alt={`${chapter.title} 썸네일`}
                        fill
                        sizes="64px"
                        className="object-cover"
                    />
                ) : (
                    "이미지 없음"
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

                <p className="mt-1 text-xs font-bold text-slate-400">
                    {formatDuration(chapter.durationSec)}
                </p>
            </div>

            <span className="text-xs font-bold text-slate-400">
                {isLocked
                    ? "잠금"
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
