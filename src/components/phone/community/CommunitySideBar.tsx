"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CommunitySideBar({ role }: { role?: "TEACHER" | "ADMIN" }) {
    const pathname = usePathname();

    const COMMUNITY_NAV_ITEMS = [
        {
            label: "홈",
            description: "추천",
            href: role === "TEACHER" ? "/teacher/community" : role === "ADMIN" ? "/admin/community" : "/student/community",
        },
        // { 모듈5때 인기글 기능 생기면 위에꺼랑 교체 하기
        //     label: "전체",
        //     description: "검색",
        //     href: "/student/community",
        //     icon: LayoutGrid,
        // },
        {
            label: "내 글",
            description: "마이",
            href: role === "TEACHER" ? "/teacher/community/mypage" : role === "ADMIN" ? "/admin/community/mypage" : "/student/community/mypage",
        },
        {
            label: "작성",
            description: "새 글",
            href: role === "TEACHER" ? "/teacher/community/create" : role === "ADMIN" ? "/admin/community/create" : "/student/community/create",
        },
    ];

    return (
        <div className="mb-6 flex border-b border-slate-200">
            <nav className="flex flex-1 gap-8">
                {COMMUNITY_NAV_ITEMS.map((item, index) => {
                    const isActive = index === 0
                        ? pathname === item.href
                        : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={`${item.href}-${item.label}`}
                            href={item.href}
                            className={`border-b-2 px-1 pb-4 text-sm font-bold transition ${isActive
                                ? "border-indigo-400 text-indigo-500"
                                : "border-transparent text-slate-500 hover:text-slate-900"
                            }`}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
