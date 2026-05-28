import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface UserManageSearchbarProps {
    role?: string;
    status?: string;
    keyword?: string;
}

export default async function UserManageSearchbar({ role, status, keyword }: UserManageSearchbarProps) {

    const params = new URLSearchParams();

    if (role) {
        params.set("role", role);
    }

    if (status) {
        params.set("status", status);
    }

    const clearHref = `?${params.toString()}`

    return (
        <form method="GET" className="flex items-center gap-3 mb-4">
            <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                {role ? <input
                    type="hidden"
                    name="role"
                    defaultValue={role}
                /> : ""}
                {status ? <input
                    type="hidden"
                    name="status"
                    defaultValue={status}
                /> : ""}
                <input
                    type="text"
                    name="keyword"
                    defaultValue={keyword}
                    placeholder="이름 또는 이메일로 검색..."
                    className="w-full h-12 pl-12 pr-4 border-2 border-slate-300 rounded-xl bg-white
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