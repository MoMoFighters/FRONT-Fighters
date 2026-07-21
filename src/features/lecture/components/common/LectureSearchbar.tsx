'use client'

import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface LectureSearchbarProps {
    status?: string;
    keyword?: string;
    category?: string;
    filter?: string;
    position?: string;
}

export default function LectureSearchbar({ status, keyword, category, filter, position }: LectureSearchbarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const buildHref = (nextKeyword?: string) => {
        const params = new URLSearchParams();

        if (status) params.set("status", status);
        if (category) params.set("category", category);
        if (filter) params.set("filter", filter);
        if (position) params.set("position", position);
        if (nextKeyword) params.set("keyword", nextKeyword);

        const queryString = params.toString();
        return queryString ? `${pathname}?${queryString}` : pathname;
    };

    // form 기본 제출(브라우저 풀 리로드) 대신 클라이언트 사이드 네비게이션으로 처리한다
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const nextKeyword = String(formData.get("keyword") ?? "").trim();

        startTransition(() => {
            router.push(buildHref(nextKeyword || undefined));
        });
    };

    const handleClear = () => {
        startTransition(() => {
            router.push(buildHref(undefined));
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-1 items-center gap-3">
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    name="keyword"
                    defaultValue={keyword}
                    placeholder="강의명 또는 강의 설명으로 검색..."
                    className="h-12 w-full rounded-xl border-2 border-slate-300 bg-white pl-12 pr-10 text-sm font-medium text-slate-700 transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
                />
                {keyword && (
                    <button
                        type="button"
                        onClick={handleClear}
                        aria-label="검색어 초기화"
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors hover:text-slate-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
            <Button
                variant="outline"
                type="submit"
                disabled={isPending}
                className="h-12 w-24 cursor-pointer rounded-xl border-2 border-slate-300 px-2 font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
                <Search className="h-6 w-6 shrink-0" />
                <span className={isPending ? "text-[10px]" : "text-[16px]"}>
                    {isPending ? "검색 중..." : "검색"}
                </span>
            </Button>
        </form>
    );
}
