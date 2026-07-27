export const LECTURE_SORT_OPTIONS = ["latest", "reviewCount", "rating"] as const;

export type LectureSortOption = typeof LECTURE_SORT_OPTIONS[number];

export const LECTURE_SORT_LABEL: Record<LectureSortOption, string> = {
    latest: "최신순",
    reviewCount: "리뷰 많은순",
    rating: "별점 높은순",
};

export const isLectureSortOption = (value?: string): value is LectureSortOption =>
    (LECTURE_SORT_OPTIONS as readonly string[]).includes(value ?? "");

export const getNextLectureSort = (current: LectureSortOption): LectureSortOption => {
    const index = LECTURE_SORT_OPTIONS.indexOf(current);
    return LECTURE_SORT_OPTIONS[(index + 1) % LECTURE_SORT_OPTIONS.length];
};

interface SortableLecture {
    createdAt: string;
    reviewCount: number;
    averageRating: number;
}

// 백엔드 페이지네이션이라 이 함수는 "현재 페이지에 내려온 항목들끼리만" 재정렬한다.
// 전체 강의 기준 정렬이 아니라는 점에 유의할 것.
export const sortLectures = <T extends SortableLecture>(
    lectures: T[],
    sort: LectureSortOption,
): T[] => {
    const sorted = [...lectures];

    if (sort === "reviewCount") {
        sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    } else if (sort === "rating") {
        sorted.sort((a, b) => b.averageRating - a.averageRating);
    } else {
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return sorted;
};
