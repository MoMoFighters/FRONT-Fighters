"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

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
        <div className="flex items-center gap-2 mb-4">

            <Button
                variant="ghost"
                onClick={() => handleClickFilter()}
                className={`
                    text-lg
                    font-semibold

                    ${!searchStatus
                        ? "text-slate-900"
                        : "text-slate-500"
                    }
                `}
            >
                전체
            </Button>

            <Button
                variant="ghost"
                onClick={() => handleClickFilter("waiting")}
                className={`
                    text-lg
                    font-semibold

                    ${searchStatus === "waiting"
                        ? "text-slate-900"
                        : "text-slate-500"
                    }
                `}
            >
                승인 대기
            </Button>

        </div>
    );
}