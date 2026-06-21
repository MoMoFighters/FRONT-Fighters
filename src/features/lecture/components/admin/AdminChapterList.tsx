import Link from "next/link";
import { PlayCircle } from "lucide-react";

import { Chapter } from "@/features/lecture/type";
import AdminLectureDeleteButton from "./AdminLectureDeleteButton";

interface AdminChapterListProps {
    lectureId: string;
    chapters: Chapter[];
    currentChapterId?: number;
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
                            <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${isCurrent ? "bg-indigo-500 text-white" : "bg-slate-100 text-indigo-500"}`}>
                                <PlayCircle className="size-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className={`text-sm font-bold ${isCurrent ? "text-indigo-600" : "text-slate-950"}`}>
                                    Chapter {chapter.orderNo}.
                                </p>
                                <p className="mt-1 truncate text-sm font-medium text-slate-500">
                                    {chapter.title}
                                </p>
                            </div>
                            <span className="text-sm font-semibold text-slate-400">
                                {formatDuration(chapter.durationSec)}
                            </span>
                        </Link>
                        <AdminLectureDeleteButton target="챕터" targetId={chapter.chapterId} />
                    </div>
                );
            })}
        </div>
    );
}
