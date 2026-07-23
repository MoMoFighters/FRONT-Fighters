"use client";

import { Filter, Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

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
    const [isPending, startTransition] = useTransition();
    const activeCategoryLabel = CATEGORY_FILTERS.find(
        (filter) => filter.value === category,
    )?.label ?? "카테고리";

    const selectCategory = (value?: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) params.set("category", value);
        else params.delete("category");

        params.delete("page");

        startTransition(() => {
            router.push(params.size ? `${pathname}?${params.toString()}` : pathname);
        });
    };

    // form 기본 제출(브라우저 풀 리로드) 대신 클라이언트 사이드 네비게이션으로 처리한다
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const nextKeyword = String(formData.get("keyword") ?? "").trim();

        const params = new URLSearchParams();
        if (status) params.set("status", status);
        if (category) params.set("category", category);
        if (nextKeyword) params.set("keyword", nextKeyword);

        startTransition(() => {
            router.push(params.size ? `${pathname}?${params.toString()}` : pathname);
        });
    };

    const handleClear = () => {
        const params = new URLSearchParams();
        if (status) params.set("status", status);
        if (category) params.set("category", category);

        startTransition(() => {
            router.push(params.size ? `${pathname}?${params.toString()}` : pathname);
        });
    };

    return (
        <form onSubmit={handleSubmit} className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
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
                    <button
                        type="button"
                        onClick={handleClear}
                        aria-label="검색어 지우기"
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-700"
                    >
                        <X className="size-4" />
                    </button>
                )}
            </div>
            <div className="flex items-center gap-2">
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isPending}
                            className="h-11 flex-1 gap-2 rounded-md border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:shrink-0"
                        >
                            <Filter className="size-4 shrink-0 text-slate-500" />
                            <span className="truncate">{activeCategoryLabel}</span>
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
                <Button
                    type="submit"
                    disabled={isPending}
                    className="h-11 w-24 shrink-0 rounded-md bg-indigo-500 px-2 font-bold text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <span className={isPending ? "text-[10px]" : "text-sm"}>
                        {isPending ? "검색 중..." : "검색"}
                    </span>
                </Button>
            </div>
        </form>
    );
}
