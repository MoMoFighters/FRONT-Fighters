import LectureForm from "@/features/lecture/teacher/LectureForm";
import Link from "next/link";

export default function TeacherLectureRegistPage() {
    return (
        <div>
            <Link href='/teacher/lectures'>{`←`}</Link>
            <LectureForm mode='create' />
        </div>
    );
}