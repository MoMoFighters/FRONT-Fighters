"use client";

import { Filter, Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminLectureSearchbarProps {
    category?: string;
    keyword?: string;
    status?: string;
}

const CATEGORY_FILTERS = [
    { label: "전체 카테고리", value: undefined },
    { label: "학습", value: "study" },
    { label: "운동", value: "fitness" },
    { label: "요리", value: "cook" },
    { label: "뷰티", value: "beauty" },
    { label: "예술", value: "art" },
];

export default function AdminLectureSearchbar({
    category,
    keyword,
    status,
}: AdminLectureSearchbarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeCategoryLabel = CATEGORY_FILTERS.find(
        (filter) => filter.value === category,
    )?.label ?? "카테고리";
    const clearParams = new URLSearchParams();

    if (status) clearParams.set("status", status);
    if (category) clearParams.set("category", category);

    const selectCategory = (value?: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) params.set("category", value);
        else params.delete("category");

        params.delete("page");
        router.push(params.size ? `${pathname}?${params.toString()}` : pathname);
    };

    return (
        <form method="GET" className="mb-5 flex items-center gap-2">
            {status && <input type="hidden" name="status" value={status} />}
            {category && <input type="hidden" name="category" value={category} />}
            <div className="relative min-w-0 flex-1">
                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                    type="search"
                    name="keyword"
                    defaultValue={keyword}
                    placeholder="강의명 또는 강의 설명으로 검색"
                    className="h-11 w-full rounded-md border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-3 focus:ring-indigo-50"
                />
                {keyword && (
                    <a
                        href={clearParams.size ? `?${clearParams.toString()}` : "?"}
                        aria-label="검색어 지우기"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                        <X className="size-4" />
                    </a>
                )}
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 shrink-0 gap-2 rounded-md border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                    >
                        <Filter className="size-4 text-slate-500" />
                        {activeCategoryLabel}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-32">
                    {CATEGORY_FILTERS.map((filter) => (
                        <DropdownMenuItem
                            key={filter.label}
                            onSelect={() => selectCategory(filter.value)}
                            className={category === filter.value ? "bg-indigo-50 font-bold text-indigo-600" : "font-medium text-slate-700"}
                        >
                            {filter.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
            <Button type="submit" className="h-11 rounded-md bg-indigo-500 px-4 text-sm font-bold text-white hover:bg-indigo-600">
                검색
            </Button>
        </form>
    );
}
