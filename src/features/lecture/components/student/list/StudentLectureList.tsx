import { Lecture } from "@/features/lecture/type";
import StudentLectureItem from "./StudentLectureItem";

const getLectureProgress = (lecture: Lecture, index = 0) => {
    if (lecture.lectureProgress !== undefined) {
        return lecture.lectureProgress;
    }

    if (!lecture.isEnrolled) {
        return 0;
    }

    return index % 2 === 0 ? 35 : 60;
};

interface StudentLectureListProps {
    lectures: Lecture[];
    getHref?: (lecture: Lecture) => string;
    showLearningStatus?: boolean;
}

export default function StudentLectureList({
    lectures,
    getHref,
    showLearningStatus = true,
}: StudentLectureListProps) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {lectures.map((lecture) => (
                <StudentLectureItem
                    key={lecture.lectureId}
                    lecture={lecture}
                    href={getHref ? getHref(lecture) : `/student/lectures/${lecture.lectureId}`}
                    showLearningStatus={showLearningStatus}
                />
            ))}
        </div>
    );
}
