import { CategoryApiUrl, CategoryUrl, Lecture } from "@/features/lecture/type";
import getCategoryMeta from "@/features/lecture/components/student/category";
import StudentLectureItem from "@/features/lecture/components/student/StudentLectureItem";

const CATEGORY_URL_MAP: Record<CategoryApiUrl, CategoryUrl> = {
    STUDY: "study",
    FITNESS: "fitness",
    COOK: "cook",
    BEAUTY: "beauty",
    ART: "art",
};

const getLectureProgress = (index = 0) => {
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
            {lectures.map((lecture, index) => {
                const category = CATEGORY_URL_MAP[lecture.category];
                const categoryMeta = getCategoryMeta(category);

                return (
                    <StudentLectureItem
                        key={lecture.lectureId}
                        lecture={lecture}
                        href={`/student/${category}/lectures/${lecture.lectureId}`}
                        categoryLabel={categoryMeta.label}
                        buildingImage={categoryMeta.buildingImage}
                        progress={getLectureProgress(index)}
                        showLearningStatus
                    />
                );
            })}
        </div>
    );
}
