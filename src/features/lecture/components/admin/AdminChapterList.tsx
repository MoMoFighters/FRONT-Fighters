import Image from "next/image";
import Link from "next/link";
import { PlayCircle } from "lucide-react";

import { Chapter } from "@/features/lecture/type";
import AdminLectureDeleteButton from "./AdminLectureDeleteButton";

interface AdminChapterListProps {
    lectureId: string;
    chapters: Chapter[];
    currentChapterId?: number;
    canDelete?: boolean;
}

const formatDuration = (durationSec: number) => {
    const minutes = Math.floor(durationSec / 60);
    const seconds = durationSec % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export default function AdminChapterList({
    lectureId,
    chapters,
    currentChapterId,
    canDelete = true,
}: AdminChapterListProps) {
    return (
        <div className="divide-y divide-slate-100">
            {chapters.map((chapter) => {
                const isCurrent = chapter.chapterId === currentChapterId;

                return (
                    <div
                        key={chapter.chapterId}
                        className={`flex items-center gap-4 p-5 ${isCurrent ? "bg-indigo-50/70" : "hover:bg-slate-50"}`}
                    >
                        <Link
                            href={`/admin/lectures/${lectureId}/chapters/${chapter.chapterId}`}
                            className="flex min-w-0 flex-1 items-center gap-4"
                        >
                            <div className={`relative flex size-[clamp(2.5rem,11cqw,2.75rem)] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-indigo-500 ${isCurrent ? "ring-2 ring-indigo-500" : ""}`}>
                                {chapter.chapterThumbnailUrl ? (
                                    <Image
                                        src={chapter.chapterThumbnailUrl}
                                        alt={`${chapter.title} 썸네일`}
                                        fill
                                        sizes="44px"
                                        className="object-cover"
                                    />
                                ) : (
                                    <PlayCircle className="size-5" />
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className={`text-[clamp(0.8125rem,3.2cqw,0.875rem)] font-bold ${isCurrent ? "text-indigo-600" : "text-slate-950"}`}>
                                    Chapter {chapter.orderNo}.
                                </p>
                                <p className="mt-1 truncate text-[clamp(0.8125rem,3.2cqw,0.875rem)] font-medium text-slate-500">
                                    {chapter.title}
                                </p>
                            </div>
                            <span className="shrink-0 text-[clamp(0.8125rem,3.2cqw,0.875rem)] font-bold text-slate-400">
                                {formatDuration(chapter.durationSec)}
                            </span>
                        </Link>
                        {canDelete && (
                            <AdminLectureDeleteButton
                                target="챕터"
                                targetId={chapter.chapterId}
                                lectureId={lectureId}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
