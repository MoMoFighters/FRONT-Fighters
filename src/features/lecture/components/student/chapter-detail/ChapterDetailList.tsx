import { Progress } from "@/components/ui/progress";
import { ChapterByMeta } from "@/features/lecture/type";
import ChapterDetailListItem from "@/features/lecture/components/student/chapter-detail/ChapterDetailListItem";

interface ChapterDetailListProps {
    category: string;
    lectureId: string;
    currentChapterId: number;
    chapters: ChapterByMeta[];
    completedCount: number;
    totalChapterCount: number;
    chapterBaseHref?: string;
}

export default function ChapterDetailList({
    category,
    lectureId,
    currentChapterId,
    chapters,
    completedCount,
    totalChapterCount,
    chapterBaseHref,
}: ChapterDetailListProps) {
    const progress = totalChapterCount > 0
        ? Math.round((completedCount / totalChapterCount) * 100)
        : 0;

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm [container-type:inline-size]">
            <h2 className="text-[clamp(0.875rem,4cqw,1rem)] font-bold text-slate-950">
                강의 챕터
            </h2>

            <div className="mt-5 border-t border-slate-100 pt-5">
                <div className="mb-3 flex items-center justify-between">
                    <span className="text-[clamp(0.75rem,3.2cqw,0.875rem)] font-bold text-slate-500">
                        전체 {totalChapterCount}개 챕터
                    </span>

                    <span className="text-[clamp(0.75rem,3.2cqw,0.875rem)] font-bold text-slate-500">
                        {completedCount} / {totalChapterCount} 완료
                    </span>
                </div>

                <Progress value={progress} />
            </div>

            <div className="mt-6 space-y-3">
                {chapters.map((chapter) => (
                    <ChapterDetailListItem
                        key={chapter.chapterId}
                        category={category}
                        lectureId={lectureId}
                        chapter={chapter}
                        isActive={chapter.chapterId === currentChapterId}
                        href={chapterBaseHref ? `${chapterBaseHref}/chapters/${chapter.chapterId}` : undefined}
                    />
                ))}
            </div>
        </section>
    );
}
