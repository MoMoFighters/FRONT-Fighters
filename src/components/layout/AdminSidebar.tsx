"use client";

import Link from "next/link";
import {
    Bell,
    CircleDollarSign,
    ClipboardCheck,
    FileText,
    FolderOpen,
    LayoutDashboard,
    ShieldAlert,
    ShieldCheck,
    Users,
} from "lucide-react";
import { usePathname } from "next/navigation";

const ADMIN_NAV_ITEMS = [
    {
        label: "대시보드",
        href: "/admin",
        icon: LayoutDashboard,
        exact: true,
    },
    {
        label: "회원 관리",
        href: "/admin/users",
        icon: Users,
    },
    {
        label: "승인 관리",
        href: "/admin/approvals",
        icon: ClipboardCheck,
    },
    {
        label: "강의 관리",
        href: "/admin/lectures",
        icon: FolderOpen,
    },
    {
        label: "신고 관리",
        href: "/admin/reports",
        icon: ShieldAlert,
    },
    {
        label: "공지사항",
        href: "/admin/notices",
        icon: Bell,
    },
    {
        label: "접근 로그",
        href: "/admin/access-logs",
        icon: FileText,
    },
    {
        label: "매출 관리",
        href: "/admin/sales",
        icon: CircleDollarSign,
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="flex h-full w-60 flex-col border-r border-slate-100 bg-white px-3">
            <div className="mt-6 flex items-center gap-3 px-3 text-lg font-black text-slate-700">
                <ShieldCheck className="h-5 w-5" />
                <p>Admin Mode</p>
            </div>

            <nav className="mt-5 space-y-2">
                {ADMIN_NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.exact
                        ? pathname === item.href
                        : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                relative flex h-10 w-full items-center gap-3 rounded-md px-3
                                text-sm font-black transition
                                ${isActive
                                    ? "bg-indigo-50 text-indigo-500"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                                }
                            `}
                        >
                            <Icon className="h-4 w-4" />
                            {item.label}

                            {isActive && (
                                <span className="absolute right-0 top-2 h-6 w-1 rounded-full bg-indigo-400" />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
