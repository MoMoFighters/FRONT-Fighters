"use client";

import Link from "next/link";
import { BookOpen, CircleHelp, Home, MessageSquareText } from "lucide-react";
import { usePathname } from "next/navigation";

export const TEACHER_NAV_ITEMS = [
    {
        label: "홈",
        href: "/teacher",
        icon: Home,
        exact: true,
    },
    {
        label: "내강의",
        href: "/teacher/lectures",
        icon: BookOpen,
    },
    {
        label: "커뮤니티",
        href: "/teacher/community",
        icon: MessageSquareText,
    },
    {
        label: "질문",
        href: "/teacher/ask",
        icon: CircleHelp,
    },
];

export default function TeacherSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden w-50 shrink-0 border-r border-slate-200 bg-white md:sticky md:top-0 md:block md:h-full">
            <nav className="flex flex-col gap-1 p-3">
                {TEACHER_NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.exact
                        ? pathname === item.href
                        : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-black transition ${isActive
                                ? "bg-indigo-50 text-indigo-500"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                        >
                            <Icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
