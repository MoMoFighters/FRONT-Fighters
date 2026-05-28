'use client'

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

export default function StudentLectureNav({ category }: { category: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const searchStatus = searchParams.get("filter");

    const handleClickFilter = (filter?: string) => {

        if (!filter) {
            router.push(`/student/${category}/lectures`);
            return;
        }
        router.push(`/student/${category}/lectures?filter=${filter}`);
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
                onClick={() => handleClickFilter("my")}
                className={`
                    text-lg
                    font-semibold

                    ${searchStatus === "my"
                        ? "text-slate-900"
                        : "text-slate-500"
                    }
                `}
            >
                내 강의
            </Button>

        </div>
    );
}