import { Chapter } from "@/features/lecture/type";
import StudentChapterListItem from "@/features/lecture/components/student/detail/StudentChapterListItem";

interface StudentChapterListProps {
    category: string;
    lectureId: string;
    chapters: Chapter[];
    isEnrolled?: boolean;
    chapterBaseHref?: string;
}

export default function StudentChapterList({
    category,
    lectureId,
    chapters,
    isEnrolled,
    chapterBaseHref,
}: StudentChapterListProps) {
    console.log(chapters, "Tlqkf")
    return (
        <div className="divide-y divide-slate-100">
            {chapters.map((chapter) => (
                <StudentChapterListItem
                    key={chapter.chapterId}
                    category={category}
                    lectureId={lectureId}
                    chapter={chapter}
                    isEnrolled={isEnrolled}
                    href={chapterBaseHref ? `${chapterBaseHref}/chapters/${chapter.chapterId}` : undefined}
                />
            ))}
        </div>
    );
}
