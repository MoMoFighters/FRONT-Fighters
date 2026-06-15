import { StaticImageData } from "next/image";

import { CategoryUrl, Lecture } from "@/features/lecture/type";
import StudentLectureItem from "./StudentLectureItem";

const getLectureProgress = (isEnrolled?: boolean, index = 0) => {
    if (!isEnrolled) {
        return 0;
    }

    return index % 2 === 0 ? 35 : 60;
};

interface StudentLectureListProps {
    lectures: Lecture[];
    category: CategoryUrl;
    categoryLabel: string;
    buildingImage: StaticImageData;
    getHref?: (lecture: Lecture) => string;
    showLearningStatus?: boolean;
}

export default function StudentLectureList({
    lectures,
    category,
    categoryLabel,
    buildingImage,
    getHref,
    showLearningStatus = true,
}: StudentLectureListProps) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {lectures.map((lecture, index) => (
                <StudentLectureItem
                    key={lecture.lectureId}
                    lecture={lecture}
                    href={getHref ? getHref(lecture) : `/student/${category}/lectures/${lecture.lectureId}`}
                    categoryLabel={categoryLabel}
                    buildingImage={buildingImage}
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
