'use client'

import { Chapter } from "@/features/lecture/type";
import { useParams, useRouter } from "next/navigation";
import { Progress } from "../ui/progress";
import { toast } from "sonner";

interface ChapterItemProps {
    isEnrolled?: boolean;
    chapter: Chapter;
    role: string;
}

export default function ChapterItem({
    isEnrolled,
    chapter,
    role
}: ChapterItemProps) {

    const router = useRouter();

    const {
        category,
        lectureId
    } = useParams<{
        category?: string;
        lectureId: string;
    }>();

    const isLocked =
        role === "student" &&
        chapter.isAccessible === false;

    const handleMoveChapterClick = () => {

        if (role === "teacher") {
            return;
        }

        if (
            role === "student" &&
            !isEnrolled
        ) {
            return;
        }

        if (isLocked) {

            toast.error(
                '이전 챕터를 완료해야 합니다.'
            );

            return;
        }

        if (category) {

            router.push(
                `/${role}/${category}/lectures/${lectureId}/chapters/${chapter.chapterId}`
            );

        } else {

            router.push(
                `/${role}/lectures/${lectureId}/chapters/${chapter.chapterId}`
            );
        }
    };

    return (
        <div
            onClick={handleMoveChapterClick}
            className={`
                flex items-center gap-6 p-4 rounded-lg
                border border-slate-200 mb-4

                ${isLocked ||
                    role === "teacher" ||
                    (role === "student" && !isEnrolled)
                    ? "bg-slate-100 opacity-60 cursor-not-allowed"
                    : "bg-white cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-slate-300"
                }
            `}
        >
            <div className="w-24 h-13.5 bg-slate-200 rounded-lg overflow-hidden shrink-0" />

            <div className="flex-1 min-w-0">
                <h3 className="text-slate-900 mb-2 text-md font-semibold">
                    Chapter {chapter.orderNo}.
                </h3>

                <p className="text-slate-500 text-sm truncate">
                    {chapter.title}
                </p>
            </div>

            {chapter.chapterProgress !== undefined && (
                <div className="w-60 flex gap-1">
                    <Progress
                        value={chapter.chapterProgress}
                        className="mt-2"
                    />

                    <p className="text-xs text-slate-400 mt-1">
                        {chapter.chapterProgress}%
                    </p>
                </div>
            )}

            <div className="text-slate-500 text-sm shrink-0 mr-4">
                {`${String(
                    Math.floor(
                        chapter.durationSec / 60
                    )
                ).padStart(2, "0")}:${String(
                    chapter.durationSec % 60
                ).padStart(2, "0")}`}
            </div>
        </div>
    );
}
