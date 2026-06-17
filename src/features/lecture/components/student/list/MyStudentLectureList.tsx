import { Lecture } from "@/features/lecture/type";
import StudentLectureItem from "@/features/lecture/components/student/list/StudentLectureItem";

const getLectureProgress = (lecture: Lecture, index = 0) => {
    if (lecture.lectureProgress !== undefined) {
        return lecture.lectureProgress;
    }

    return index % 2 === 0 ? 35 : 60;
};

interface MyStudentLectureListProps {
    lectures: Lecture[];
}

export default function MyStudentLectureList({
    lectures,
}: MyStudentLectureListProps) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {lectures.map((lecture, index) => (
                <StudentLectureItem
                    key={lecture.lectureId}
                    lecture={lecture}
                    href={`/student/mypage/lectures/${lecture.lectureId}`}
                    progress={getLectureProgress(lecture, index)}
                    showLearningStatus
                />
            ))}
        </div>
    );
}
