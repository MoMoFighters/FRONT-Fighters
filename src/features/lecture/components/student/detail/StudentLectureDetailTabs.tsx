import Link from "next/link";

interface StudentLectureDetailTabsProps {
    href: string;
    currentTab: "chapters" | "reviews";
    reviewCount: number;
}

const createHrefWithParams = (
    href: string,
    nextParams: Record<string, string | undefined>,
) => {
    const [pathname, search = ""] = href.split("?");
    const params = new URLSearchParams(search);

    Object.entries(nextParams).forEach(([key, value]) => {
        if (!value) {
            params.delete(key);
            return;
        }

        params.set(key, value);
    });

    const queryString = params.toString();

    return queryString ? `${pathname}?${queryString}` : pathname;
};

export default function StudentLectureDetailTabs({
    href,
    currentTab,
    reviewCount,
}: StudentLectureDetailTabsProps) {
    const chaptersHref = createHrefWithParams(href, {
        tab: undefined,
        page: undefined,
    });

    const reviewsHref = createHrefWithParams(href, {
        tab: "reviews",
        page: undefined,
    });

    return (
        <div className="border-b border-slate-200 px-5 pt-5">
            <nav className="flex gap-8">
                <Link
                    href={chaptersHref}
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
                    href={reviewsHref}
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
