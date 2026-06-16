import { Lecture } from "@/features/lecture/type";
import StudentLectureItem from "./StudentLectureItem";

const getLectureProgress = (isEnrolled?: boolean, index = 0) => {
    if (!isEnrolled) {
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
            {lectures.map((lecture, index) => (
                <StudentLectureItem
                    key={lecture.lectureId}
                    lecture={lecture}
                    href={getHref ? getHref(lecture) : `/student/${lecture.category}/lectures/${lecture.lectureId}`}
                    progress={getLectureProgress(
                        lecture.isEnrolled,
                        index
                    )}
                    showLearningStatus={showLearningStatus}
                />
            ))}
        </div>
    );
}
