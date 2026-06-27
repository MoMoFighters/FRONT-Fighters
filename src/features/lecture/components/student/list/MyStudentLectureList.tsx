import StudentLectureItem from "@/features/lecture/components/student/list/StudentLectureItem";
import { Lecture } from "@/features/lecture/type";

interface MyStudentLectureListProps {
    lectures: Lecture[];
}

export default function MyStudentLectureList({
    lectures,
}: MyStudentLectureListProps) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {lectures.map((lecture) => (
                <StudentLectureItem
                    key={lecture.lectureId}
                    lecture={lecture}
                    href={`/student/mypage/lectures/${lecture.lectureId}`}
                    showLearningStatus
                />
            ))}
        </div>
    );
}
