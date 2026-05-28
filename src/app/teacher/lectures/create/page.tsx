import MovePageBackBtn from "@/components/common/MovePageBackBtn";
import LectureForm from "@/features/lecture/components/teacher/LectureForm";

export default function TeacherLectureRegistPage() {
    return (
        <div className="p-12 relative">
            <div className="flex flex-row">
                <MovePageBackBtn href="/teacher/lectures" />
                <div className="flex-1"></div>
            </div>
            <LectureForm mode='create' />
        </div>
    );
}