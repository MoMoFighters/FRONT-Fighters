import Link from "next/link";

interface StudentLectureDetailTabsProps {
    href: string;
    currentTab: "chapters" | "reviews";
    reviewCount: number;
}

export default function StudentLectureDetailTabs({
    href,
    currentTab,
    reviewCount,
}: StudentLectureDetailTabsProps) {
    return (
        <div className="border-b border-slate-200 px-5 pt-5">
            <nav className="flex gap-8">
                <Link
                    href={href}
                    className={`
                        border-b-2 px-1 pb-4 text-sm font-bold transition
                        ${currentTab === "chapters"
                            ? "border-indigo-400 text-indigo-500"
                            : "border-transparent text-slate-500 hover:text-slate-900"
                        }
                    `}
                >
                    챕터
                </Link>

                <Link
                    href={`${href}?tab=reviews`}
                    className={`
                        border-b-2 px-1 pb-4 text-sm font-bold transition
                        ${currentTab === "reviews"
                            ? "border-indigo-400 text-indigo-500"
                            : "border-transparent text-slate-500 hover:text-slate-900"
                        }
                    `}
                >
                    수강평 ({reviewCount})
                </Link>
            </nav>
        </div>
    );
}
