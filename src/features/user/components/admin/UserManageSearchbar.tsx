import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import UserRoleFilter from "./UserRoleFilter";

interface UserManageSearchbarProps {
    role?: string;
    status?: string;
    keyword?: string;
}

export default function UserManageSearchbar({
    role,
    status,
    keyword,
}: UserManageSearchbarProps) {
    const params = new URLSearchParams();

    if (role) params.set("role", role);
    if (status) params.set("status", status);

    const clearHref = params.size ? `?${params.toString()}` : "?";

    return (
        <form method="GET" className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
            {role && <input type="hidden" name="role" value={role} />}
            {status && <input type="hidden" name="status" value={status} />}
            <div className="relative min-w-0 flex-1">
                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                    type="search"
                    name="keyword"
                    defaultValue={keyword}
                    placeholder="이름 또는 이메일로 회원 찾기"
                    className="h-11 w-full rounded-md border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-3 focus:ring-indigo-50"
                />
                {keyword && (
                    <a href={clearHref} aria-label="검색어 지우기" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                        <X className="size-4" />
                    </a>
                )}
            </div>
            <div className="flex items-center gap-2">
                {status !== "pending" && <UserRoleFilter />}
                <Button type="submit" className="h-11 shrink-0 rounded-md bg-indigo-500 px-4 text-sm font-bold text-white hover:bg-indigo-600">
                    검색
                </Button>
            </div>
        </form>
    );
}
