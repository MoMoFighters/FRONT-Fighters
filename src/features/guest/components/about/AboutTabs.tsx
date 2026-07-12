import Link from "next/link";

import { AboutTab } from "@/features/guest/about/type";

interface AboutTabsProps {
    currentTab: AboutTab;
}

const TAB_ITEMS: { value: AboutTab; label: string }[] = [
    { value: "all", label: "공통" },
    { value: "student", label: "수강생" },
    { value: "teacher", label: "강사" },
];

const createTabHref = (tab: AboutTab) =>
    tab === "all" ? "/about" : `/about?tab=${tab}`;

export default function AboutTabs({ currentTab }: AboutTabsProps) {
    return (
        <div className="border-b border-slate-200 bg-white">
            <nav className="flex justify-center gap-8 px-5 sm:px-8 lg:px-16">
                {TAB_ITEMS.map((tab) => (
                    <Link
                        key={tab.value}
                        href={createTabHref(tab.value)}
                        className={`
                            border-b-2 px-1 py-4 text-sm font-bold transition
                            ${currentTab === tab.value
                                ? "border-indigo-400 text-indigo-500"
                                : "border-transparent text-slate-500 hover:text-slate-900"
                            }
                        `}
                    >
                        {tab.label}
                    </Link>
                ))}
            </nav>
        </div>
    );
}
