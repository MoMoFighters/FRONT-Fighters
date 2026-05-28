import MovePageBackBtn from "@/components/common/MovePageBackBtn";
import LectureForm from "@/features/lecture/components/teacher/LectureForm";

export default async function LectureEditPage({ params }: { params: Promise<{ lectureId: string }> }) {

    const { lectureId } = await params;

    return (
        <div className="p-12 relative">
            <MovePageBackBtn href={`/teacher/lectures/${lectureId}`} />
            <LectureForm mode='edit' />
        </div>
    );
}