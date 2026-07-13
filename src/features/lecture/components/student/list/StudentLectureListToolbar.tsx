import LectureSearchbar from "@/features/lecture/components/common/LectureSearchbar";
import StudentLectureNav from "@/features/lecture/components/student/list/StudentLectureNav";

interface StudentLectureListToolbarProps {
    keyword?: string;
    filter?: string;
    totalElements: number;
}

export default function StudentLectureListToolbar({
    keyword,
    filter,
    totalElements,
}: StudentLectureListToolbarProps) {
    return (
        <>
            <StudentLectureNav keyword={keyword} filter={filter} />

            <div className="mb-4">
                <LectureSearchbar keyword={keyword} filter={filter} />
            </div>

            <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-bold text-slate-500">
                    전체{" "}
                    <span className="text-indigo-500">
                        {totalElements}
                    </span>
                    개
                </p>
            </div>
        </>
    );
}
