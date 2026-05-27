import LectureForm from "@/features/lecture/teacher/LectureForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TeacherLectureRegistPage() {
    return (
        <div>
            <div className="flex flex-row">
                <Link href='/teacher/lectures'>
                    <ArrowLeft />
                </Link>
                <div className="flex-1"></div>
            </div>
            <LectureForm mode='create' />
        </div>
    );
}