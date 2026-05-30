'use client'

import { CategoryUrl, Chapter } from "@/features/lecture/type";
import { useParams, useRouter } from "next/navigation";
import { Progress } from "../ui/progress";

export default function ChapterItem({ isEnrolled, chapter, role }: {
    isEnrolled?: boolean;
    chapter: Chapter;
    role: string;
}) {
    const router = useRouter();

    const { category, lectureId } = useParams<{
        category: CategoryUrl;
        lectureId: string;
    }>();

    const handleMoveChapterClick = () => {
        if (role === "teacher") return;
        if (role === "student" && !isEnrolled) return;

        if (category) {
            router.push(`/${role}/${category}/lectures/${lectureId}/chapters/${chapter.chapterId}`)
        } else {
            router.push(`/${role}/lectures/${lectureId}/chapters/${chapter.chapterId}`)
        }
    }

    return (
        <div>
            <div onClick={handleMoveChapterClick}
                className={`flex items-center gap-6 p-4 rounded-lg ${(role === "student" && isEnrolled) || role === "admin" ?
                    'bg-white cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-slate-300'
                    : 'bg-slate-50'
                    } 
                    border border-slate-200 mb-4
                    }`}
            >
                {/* Thumbnail */}
                <div className="w-24 h-13.5 bg-slate-200 rounded-lg overflow-hidden shrink-0">
                    {/* <img
                        src={""}    
                        alt=""
                        className="w-full h-full bject-cover opacity-60"
                    /> */}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-slate-900 mb-2 text-md font-semibold">Chapter {chapter.orderNo}.</h3>
                    <p className="text-slate-500 text-sm truncate">{chapter.title}</p>
                </div>

                {chapter.progressRate !== undefined && (
                    <div className="w-60 flex gap-1">
                        <Progress
                            value={chapter.progressRate}
                            className="mt-2"
                        />

                        <p className="text-xs text-slate-400 mt-1">
                            {chapter.progressRate}%
                        </p>
                    </div>
                )}

                {/* Duration */}
                <div className="text-slate-500 text-sm shrink-0 mr-4">
                    {`${String(Math.floor(chapter.durationSec / 60)).padStart(2, '0')}:${String(chapter.durationSec % 60).padStart(2, '0')}`}
                </div>
            </div>
        </div>
    );
}