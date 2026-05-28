'use client'

import { Chapter } from "@/app/admin/lectures/[lectureId]/page";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function ChapterItem({ isEnrolled, chapter, role }: {
    isEnrolled?: boolean;
    chapter: Chapter;
    role: string;
}) {
    const router = useRouter();

    const { category, lectureId } = useParams<{
        category: string;
        lectureId: string;
    }>();

    const searchParams = useSearchParams();

    const filter = searchParams.get("filter");

    const handleMoveChapterClick = () => {
        if (role === "teacher") return;
        if (role === "student" && !isEnrolled) return;

        const queryString = filter
            ? `?filter=${filter}`
            : "";

        if (category) {
            router.push(`/${role}/${category}/lectures/${lectureId}/chapters/${chapter.id}${queryString}`)
        } else {
            router.push(`/${role}/lectures/${lectureId}/chapters/${chapter.id}${queryString}`)
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

                {/* Duration */}
                <div className="text-slate-500 text-sm shrink-0 mr-4">
                    {chapter.duration}
                </div>
            </div>
        </div>
    );
}