import Image from "next/image";
import { BookOpen, LockKeyhole } from "lucide-react";

import { Chapter } from "@/features/lecture/type";

interface GuestLockedChapterListProps {
    chapters: Chapter[];
}

const formatDuration = (durationSec: number) => {
    if (!durationSec) {
        return "시간 준비 중";
    }

    const minutes = Math.ceil(durationSec / 60);

    return `${minutes}분`;
};

const getChapterThumbnail = (chapter: Chapter) =>
    chapter.thumbnailUrl ??
    chapter.chapterThumbnailUrl ??
    chapter.thumbnailImageUrl ??
    chapter.chapterThumbnailImageUrl;

export default function GuestLockedChapterList({
    chapters,
}: GuestLockedChapterListProps) {
    if (chapters.length === 0) {
        return (
            <div className="flex h-64 flex-col items-center justify-center gap-3 text-slate-400">
                <BookOpen className="h-11 w-11" />
                <p className="text-sm font-bold">
                    아직 등록된 챕터가 없습니다.
                </p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-slate-100">
            {chapters.map((chapter) => {
                const thumbnail = getChapterThumbnail(chapter);

                return (
                    <article
                        key={chapter.chapterId}
                        className="grid grid-cols-1 items-center gap-3 px-5 py-4 md:grid-cols-[112px_minmax(0,1fr)_120px] md:gap-4"
                    >
                        <div className="relative h-16 overflow-hidden rounded-lg bg-slate-100">
                            {thumbnail ? (
                                <Image
                                    src={thumbnail}
                                    alt={chapter.title}
                                    fill
                                    sizes="112px"
                                    quality={70}
                                    className="object-cover opacity-75"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-slate-300">
                                    <BookOpen className="h-7 w-7" />
                                </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20">
                                <LockKeyhole className="h-5 w-5 text-white" />
                            </div>
                        </div>

                        <div className="min-w-0">
                            <p className="text-[11px] font-bold text-indigo-400">
                                Chapter {chapter.orderNo}
                            </p>
                            <h3 className="mt-1 truncate text-sm font-bold text-slate-900">
                                {chapter.title}
                            </h3>
                            <p className="mt-1 text-xs font-medium text-slate-400">
                                {formatDuration(chapter.durationSec)}
                            </p>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
