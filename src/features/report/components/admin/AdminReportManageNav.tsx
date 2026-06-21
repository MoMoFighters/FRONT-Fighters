import Link from "next/link";

interface AdminReportManageNavProps {
    currentView: "all" | "unread";
}

const tabs = [
    { label: "전체", href: "/admin/reports", view: "all" },
    { label: "미처리", href: "/admin/reports?status=unread", view: "unread" },
] as const;

export default function AdminReportManageNav({
    currentView,
}: AdminReportManageNavProps) {
    return (
        <nav
            aria-label="신고 관리 구분"
            className="mb-8 flex border-b border-slate-200"
        >
            {tabs.map((tab) => {
                const isActive = currentView === tab.view;

                return (
                    <Link
                        key={tab.view}
                        href={tab.href}
                        className={`border-b-2 px-5 py-3 text-sm font-bold transition-colors ${
                            isActive
                                ? "border-indigo-500 text-indigo-500"
                                : "border-transparent text-slate-500 hover:text-slate-900"
                        }`}
                    >
                        {tab.label}
                    </Link>
                );
            })}
        </nav>
    );
}
