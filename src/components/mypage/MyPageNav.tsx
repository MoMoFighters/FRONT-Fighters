'use client'
import TeacherRegistModal from "@/features/auth/components/TeacherRegistModal";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
        label: "포인트 현황",
        href: "/student/mypage/point",
        value: "point",
    },
];

export default function MyPageNav({ isPaid }: { isPaid?: boolean | undefined }) {
    const pathName = usePathname();
    const currentPage = pathName.split("/").pop() || "mypage";

    const [isModal, setIsModal] = useState(false);

    return (
        <div className="mb-6 border-b border-slate-200 flex">
            <nav className="flex gap-8 flex-1">
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
            {!isPaid && (
                <TeacherRegistModal isModal={isModal} setIsModal={setIsModal} nickName="모모쌤" />
            )
            }
        </div >
    );
}
