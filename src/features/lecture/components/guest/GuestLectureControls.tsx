import Link from "next/link";
import { Search } from "lucide-react";

const categories = [
    {
        label: "전체",
        value: undefined,
    },
    {
        label: "학습",
        value: "study",
    },
    {
        label: "운동",
        value: "fitness",
    },
    {
        label: "요리",
        value: "cook",
    },
    {
        label: "뷰티",
        value: "beauty",
    },
    {
        label: "예술",
        value: "art",
    },
];

interface GuestLectureControlsProps {
    keyword?: string;
    category?: string;
    totalElements: number;
}

export default function GuestLectureControls({
    keyword,
    category,
    totalElements,
}: GuestLectureControlsProps) {
    const createCategoryHref = (nextCategory?: string) => {
        const params = new URLSearchParams();

        if (keyword) {
            params.set("keyword", keyword);
        }

        if (nextCategory) {
            params.set("category", nextCategory);
        }

        const queryString = params.toString();

        return queryString ? `/lectures?${queryString}` : "/lectures";
    };

    return (
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold text-slate-950">
                        전체 강의
                    </h2>
                    <p className="mt-1 text-xs font-medium text-slate-500">
                        총 <span className="font-bold text-indigo-500">{totalElements}</span>개의 강의를 확인할 수 있습니다.
                    </p>
                </div>

                <form method="GET" action="/lectures" className="flex w-full max-w-md items-center gap-2">
                    {category && (
                        <input type="hidden" name="category" defaultValue={category} />
                    )}

                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            name="keyword"
                            defaultValue={keyword}
                            placeholder="강의명 또는 설명 검색"
                            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs font-medium text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-200 focus:bg-white focus:ring-3 focus:ring-indigo-50"
                        />
                    </div>

                    <button
                        type="submit"
                        className="h-10 rounded-lg bg-slate-900 px-4 text-xs font-bold text-white transition-colors hover:bg-slate-800"
                    >
                        검색
                    </button>
                </form>
            </div>

            <div className="flex flex-wrap gap-2">
                {categories.map((item) => {
                    const isActive =
                        item.value === undefined
                            ? !category
                            : category?.toLowerCase() === item.value;

                    return (
                        <Link
                            key={item.label}
                            href={createCategoryHref(item.value)}
                            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${isActive
                                ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                                : "border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:text-indigo-500"
                                }`}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
