"use client";

import Link from "next/link";
import { FilePlus2, Home, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";

const COMMUNITY_NAV_ITEMS = [
    {
        label: "홈",
        description: "추천",
        href: "/student/phone/community",
        icon: Home,
    },
    // { 모듈5때 인기글 기능 생기면 위에꺼랑 교체 하기
    //     label: "전체",
    //     description: "검색",
    //     href: "/student/phone/community",
    //     icon: LayoutGrid,
    // },
    {
        label: "내 글",
        description: "마이",
        href: "/student/phone/community/mypage",
        icon: UserRound,
    },
    {
        label: "작성",
        description: "새 글",
        href: "/student/phone/community/create",
        icon: FilePlus2,
    },
];

export default function CommunitySideBar() {
    const pathname = usePathname();

    return (
        <aside className="h-full w-[76px] shrink-0 border-r border-slate-200/70 bg-white/70 backdrop-blur">
            <nav className="flex h-full flex-col gap-1 px-1.5 py-2">
                {COMMUNITY_NAV_ITEMS.map((item, index) => {
                    const Icon = item.icon;
                    const isActive =
                        item.href === "/student/phone/community"
                            ? pathname === item.href && index === 0
                            : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={`${item.href}-${item.label}`}
                            href={item.href}
                            className={`group flex h-[72px] flex-col items-center justify-center rounded-2xl border text-center transition-all ${isActive
                                ? "border-indigo-200 bg-indigo-50 text-indigo-500 shadow-sm"
                                : "border-transparent text-slate-400 hover:border-slate-100 hover:bg-white hover:text-slate-700 hover:shadow-sm"
                                }`}
                        >
                            <Icon
                                className={`h-5 w-5 transition ${isActive
                                    ? "stroke-[2.6]"
                                    : "group-hover:-translate-y-0.5"
                                    }`}
                            />
                            <span className="mt-1 text-[11px] font-black leading-none">
                                {item.label}
                            </span>
                            <span className="mt-0.5 text-[9px] font-bold leading-none opacity-60">
                                {item.description}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
