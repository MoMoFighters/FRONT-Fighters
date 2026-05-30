'use client'

import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useParams } from "next/navigation";

interface LectureSearchbarProps {
    status?: string;
    keyword?: string;
    category?: string;
    filter?: string;
}

export default function LectureSearchbar({ status, keyword, category, filter }: LectureSearchbarProps) {

    const urlParams = new URLSearchParams();

    const routeParams = useParams();

    if (status) {
        urlParams.set("status", status);
    }

    if (category) {
        urlParams.set("category", category);
    }

    if (filter) {
        urlParams.set("filter", filter);
    }

    const clearHref = `?${urlParams.toString()}`;

    return (
        <form method="GET" className=" flex items-center gap-3 flex-1">
            <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                {status ? <input
                    type="hidden"
                    name="status"
                    defaultValue={status}
                /> : ""}
                {category ? <input
                    type="hidden"
                    name="category"
                    defaultValue={category}
                /> : ""}
                {filter ? <input
                    type="hidden"
                    name="filter"
                    defaultValue={filter}
                /> : ""}
                <input
                    type="text"
                    name="keyword"
                    defaultValue={keyword}
                    placeholder="강의명 또는 강의 설명으로 검색..."
                    className="w-full h-12 pl-12 pr-10 border-2 border-slate-300 rounded-xl bg-white
                        text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 transition-colors"
                />
                {keyword && (
                    <a
                        href={clearHref}
                        className="
                                absolute
                                right-3 top-1/2
                                -translate-y-1/2

                                text-slate-400
                                hover:text-slate-600

                                transition-colors
                            "
                    >
                        <X className="w-4 h-4" />
                    </a>
                )}
            </div>
            <Button variant="outline" type="submit" className="h-12 px-4 text-slate-700 border-2 rounded-xl border-slate-300 font-semibold text-[16px] cursor-pointer">
                <Search className="w-6 h-6" />
                검색
            </Button>
        </form>
    );
}