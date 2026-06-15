'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
    {
        label: "내 정보",
        href: "/student/mypage",
        value: "mypage",
    },
    {
        label: "내 강의",
        href: "/student/mypage/lectures",
        value: "lectures",
    },
    {
        label: "신고 내역",
        href: "/student/mypage/reports",
        value: "reports",
    },
];

export default function MyPageNav() {
    const pathName = usePathname();
    const currentPage = pathName.split("/").pop() || "mypage";

    return (
        <div className="mb-6 border-b border-slate-200">
            <nav className="flex gap-8">
                {NAV_ITEMS.map((item) => {
                    const isActive = currentPage === item.value;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                border-b-2 px-1 pb-4 text-sm font-bold transition
                                ${isActive
                                    ? "border-indigo-400 text-indigo-500"
                                    : "border-transparent text-slate-500 hover:text-slate-900"
                                }
                            `}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
