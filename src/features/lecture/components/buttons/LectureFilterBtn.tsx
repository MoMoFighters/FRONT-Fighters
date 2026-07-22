'use client'

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function LectureFilterBtn() {

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const handleFilter = (category?: string) => {
        const params = new URLSearchParams(searchParams);

        params.delete("page");

        if (category) {
            params.set("category", category);
        } else {
            params.delete("category");
        }

        const queryString = params.toString();

        startTransition(() => {
            router.push(queryString
                ? `${pathname}?${queryString}`
                : pathname
            );
        });
    };

    return (
        <DropdownMenu modal={false}>

            <DropdownMenuTrigger asChild>

                <div>
                    <Button
                        variant="outline"
                        disabled={isPending}
                        className="h-12 px-4 text-slate-700 border-2 rounded-xl border-slate-300 font-bold text-[16px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Filter className="w-5 h-5" />
                        필터
                    </Button>
                </div>

            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="center"
            >
                <DropdownMenuItem
                    className="
                                justify-center
                                    text-slate-500
                                    focus:text-slate-700
                                    focus:bg-slate-50
                                "
                    onClick={() => handleFilter()}
                >전체</DropdownMenuItem>
                <DropdownMenuItem
                    className="
                                justify-center
                                    text-slate-500
                                    focus:text-slate-700
                                    focus:bg-slate-50
                                "
                    onClick={() => handleFilter("study")}
                >학습</DropdownMenuItem>

                <DropdownMenuItem
                    className="
                                justify-center
                                    text-slate-500
                                    focus:text-slate-700
                                    focus:bg-slate-50
                                "
                    onClick={() => handleFilter("fitness")}
                >운동</DropdownMenuItem>

                <DropdownMenuItem
                    className="
                                justify-center
                                    text-slate-500
                                    focus:text-slate-700
                                    focus:bg-slate-50
                                "
                    onClick={() => handleFilter("cook")}
                >요리</DropdownMenuItem>

                <DropdownMenuItem
                    className="
                                justify-center
                                    text-slate-500
                                    focus:text-slate-700
                                    focus:bg-slate-50
                                "
                    onClick={() => handleFilter("art")}
                >예술</DropdownMenuItem>

                <DropdownMenuItem
                    className="
                                justify-center
                                    text-slate-500
                                    focus:text-slate-700
                                    focus:bg-slate-50
                                "
                    onClick={() => handleFilter("beauty")}
                >뷰티</DropdownMenuItem>

            </DropdownMenuContent>

        </DropdownMenu>
    );
}
