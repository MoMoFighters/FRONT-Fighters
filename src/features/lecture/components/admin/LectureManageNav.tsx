"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function LectureManageNav() {

    const router = useRouter();
    const searchParams = useSearchParams();

    const searchStatus = searchParams.get("status");

    const handleClickFilter = (status?: string) => {

        if (!status) {
            router.push("/admin/lectures");
            return;
        }
        router.push(`/admin/lectures?status=${status}`);
    };

    return (
        <nav className="mb-6 flex items-center gap-6 border-b border-slate-200" aria-label="강의 관리 구분">

            <button
                type="button"
                onClick={() => handleClickFilter()}
                className={`
                    relative pb-3 text-sm font-bold transition
                    ${!searchStatus
                        ? "text-indigo-600"
                        : "text-slate-500 hover:text-slate-900"
                    }
                `}
            >
                전체
                {!searchStatus && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-indigo-500" />}
            </button>

            <button
                type="button"
                onClick={() => handleClickFilter("waiting")}
                className={`
                    relative pb-3 text-sm font-bold transition
                    ${searchStatus === "waiting"
                        ? "text-indigo-600"
                        : "text-slate-500 hover:text-slate-900"
                    }
                `}
            >
                승인 대기
                {searchStatus === "waiting" && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-indigo-500" />}
            </button>

        </nav>
    );
}
