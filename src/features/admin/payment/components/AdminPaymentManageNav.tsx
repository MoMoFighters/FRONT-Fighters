import Link from "next/link";

interface AdminPaymentManageNavProps {
    currentView: "all" | "success" | "refund";
}

const tabs = [
    { label: "전체", href: "/admin/payment", view: "all" },
    { label: "결제", href: "/admin/payment?status=success", view: "success" },
    { label: "환불", href: "/admin/payment?status=refund", view: "refund" },
] as const;

export default function AdminPaymentManageNav({
    currentView,
}: AdminPaymentManageNavProps) {
    return (
        <nav
            aria-label="매출 관리 구분"
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
