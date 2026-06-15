import { CategoryUrl, Chapter } from "@/features/lecture/type";
import StudentChapterListItem from "@/features/lecture/components/student/StudentChapterListItem";

interface StudentChapterListProps {
    category: CategoryUrl;
    lectureId: string;
    chapters: Chapter[];
    isEnrolled?: boolean;
}

export default function StudentChapterList({
    category,
    lectureId,
    chapters,
    isEnrolled,
}: StudentChapterListProps) {
    return (
        <div className="divide-y divide-slate-100">
            {chapters.map((chapter) => (
                <StudentChapterListItem
                    key={chapter.chapterId}
                    category={category}
                    lectureId={lectureId}
                    chapter={chapter}
                    isEnrolled={isEnrolled}
                />
            ))}
        </div>
    );
}
