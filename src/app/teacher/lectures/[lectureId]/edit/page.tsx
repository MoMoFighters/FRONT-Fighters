import MovePageBackBtn from "@/components/common/MovePageBackBtn";
import LectureForm from "@/features/lecture/components/teacher/LectureForm";
import { getLectureById } from "@/app/services/lecture/service";

export default async function LectureEditPage({ params }: { params: Promise<{ lectureId: string }> }) {

    const { lectureId } = await params;
    const lecture = await getLectureById(lectureId);

    return (
        <div className="p-4 sm:p-8 lg:p-12 relative">
            <MovePageBackBtn href={`/teacher/lectures/${lectureId}`} />
            <LectureForm
                mode='edit'
                lectureId={lectureId}
                initialLecture={{
                    title: lecture.title,
                    description: lecture.description,
                    thumbnailUrl: lecture.thumbnailUrl,
                    category: lecture.category,
                    chapters: lecture.chapters.map((chapter) => ({
                        chapterId: chapter.chapterId,
                        orderNo: chapter.orderNo,
                        title: chapter.title,
                        chapterThumbnailUrl: chapter.chapterThumbnailUrl,
                    })),
                }}
            />
        </div>
    );
}
