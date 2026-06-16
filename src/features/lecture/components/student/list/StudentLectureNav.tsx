import Link from "next/link";

export default function StudentLectureNav({ keyword, filter }: { keyword?: string, filter?: string }) {

    const createFilterHref = (nextFilter?: string) => {
        const params = new URLSearchParams();

        if (keyword) {
            params.set("keyword", keyword);
        }

        if (nextFilter) {
            params.set("filter", nextFilter);
        }

        return `?${params.toString()}`;
    };

    return (
        <div className="mb-6 border-b border-slate-200">
            <nav className="flex gap-8">
                <Link
                    href={createFilterHref()}
                    className={`
                                            border-b-2 px-1 pb-4 text-sm font-bold transition
                                            ${filter !== "my"
                            ? "border-indigo-400 text-indigo-500"
                            : "border-transparent text-slate-500 hover:text-slate-900"
                        }
                                        `}
                >
                    전체
                </Link>

                <Link
                    href={createFilterHref("my")}
                    className={`
                                            border-b-2 px-1 pb-4 text-sm font-bold transition
                                            ${filter === "my"
                            ? "border-indigo-400 text-indigo-500"
                            : "border-transparent text-slate-500 hover:text-slate-900"
                        }
                                        `}
                >
                    내 강의
                </Link>
            </nav>
        </div>
    );
}