"use client";

import { Filter } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const ROLE_FILTERS = [
    { label: "전체 회원", value: undefined },
    { label: "수강생", value: "student" },
    { label: "강사", value: "teacher" },
];

export default function UserRoleFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const role = searchParams.get("role");
    const activeLabel = ROLE_FILTERS.find((filter) => filter.value === role)?.label ?? "회원 유형";

    const selectRole = (value?: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set("role", value);
        } else {
            params.delete("role");
        }

        params.delete("page");
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className="h-11 flex-1 gap-2 rounded-md border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 hover:bg-slate-50 sm:flex-none sm:shrink-0"
                >
                    <Filter className="size-4 shrink-0 text-slate-500" />
                    <span className="truncate">{activeLabel}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-32">
                {ROLE_FILTERS.map((filter) => (
                    <DropdownMenuItem
                        key={filter.label}
                        onSelect={() => selectRole(filter.value)}
                        className={role === filter.value ? "bg-indigo-50 font-bold text-indigo-600" : "font-medium text-slate-700"}
                    >
                        {filter.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
