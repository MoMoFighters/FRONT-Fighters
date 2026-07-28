import LectureSearchbar from "@/features/lecture/components/common/LectureSearchbar";
import LectureSortButton from "@/features/lecture/components/buttons/LectureSortButton";
import StudentLectureNav from "@/features/lecture/components/student/list/StudentLectureNav";
import { LectureSortOption } from "@/features/lecture/utils/lectureSort";

interface StudentLectureListToolbarProps {
    keyword?: string;
    filter?: string;
    totalElements: number;
    currentSort: LectureSortOption;
    sortHref: string;
}

export default function StudentLectureListToolbar({
    keyword,
    filter,
    totalElements,
    currentSort,
    sortHref,
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

                <LectureSortButton
                    currentSort={currentSort}
                    href={sortHref}
                    className="text-sm"
                />
            </div>
        </>
    );
}
