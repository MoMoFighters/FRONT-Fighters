import Link from "next/link";

import { LECTURE_SORT_LABEL, LectureSortOption } from "@/features/lecture/utils/lectureSort";

interface LectureSortButtonProps {
    currentSort: LectureSortOption;
    href: string;
    className?: string;
}

export default function LectureSortButton({
    currentSort,
    href,
    className = "",
}: LectureSortButtonProps) {
    return (
        <Link
            href={href}
            className={`cursor-pointer rounded-md bg-white px-2 py-1 font-bold text-slate-500 transition-colors hover:bg-slate-50 ${className}`}
        >
            {LECTURE_SORT_LABEL[currentSort]}
        </Link>
    );
}
