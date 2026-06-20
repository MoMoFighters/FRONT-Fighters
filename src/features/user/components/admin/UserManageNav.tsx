"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const TABS = [
    { label: "전체", value: "all" },
    { label: "승인 대기", value: "pending" },
    { label: "탈퇴 회원", value: "deleted" },
] as const;

export default function UserManageNav() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeView = searchParams.get("status") === "pending"
        ? "pending"
        : searchParams.get("status") === "deleted"
            ? "deleted"
            : "all";

    const moveTo = (view: (typeof TABS)[number]["value"]) => {
        const params = new URLSearchParams();

        if (view === "pending") {
            params.set("status", "pending");
        }

        if (view === "deleted") {
            params.set("status", "deleted");
        }

        router.push(params.size ? `${pathname}?${params.toString()}` : pathname);
    };

    return (
        <nav className="mb-6 flex items-center gap-6 border-b border-slate-200" aria-label="회원 관리 구분">
            {TABS.map((tab) => {
                const isActive = activeView === tab.value;

                return (
                    <button
                        key={tab.value}
                        type="button"
                        onClick={() => moveTo(tab.value)}
                        className={`relative pb-3 text-sm font-bold transition ${isActive ? "text-indigo-600" : "text-slate-500 hover:text-slate-900"}`}
                    >
                        {tab.label}
                        {isActive && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-indigo-500" />}
                    </button>
                );
            })}
        </nav>
    );
}
