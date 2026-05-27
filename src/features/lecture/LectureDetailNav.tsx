'use client'

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * 
 * @param param0 예 : `/teacher/lectures/${lectureId}`
 * @returns 
 */
export default function LectureDetailNav({ href }: { href: string; }) {

    const router = useRouter();
    const searchParams = useSearchParams();

    const searchStatus = searchParams.get("tab");

    const handleClickTab = (tab?: string) => {

        const params = new URLSearchParams(searchParams.toString());

        params.delete("page");

        if (!tab) {
            params.delete("tab");
        } else {
            params.set("tab", tab);
        }

        const queryString = params.toString();

        router.push(
            queryString
                ? `${href}?${queryString}`
                : href
        );
    };
    return (
        <div className="flex items-center gap-2 my-4">

            <Button
                variant="ghost"
                onClick={() => handleClickTab()}
                className={`
                    text-lg
                    font-semibold

                    ${!searchStatus
                        ? "text-slate-900"
                        : "text-slate-500"
                    }
                `}
            >
                챕터
            </Button>

            <Button
                variant="ghost"
                onClick={() => handleClickTab("reviews")}
                className={`
                    text-lg
                    font-semibold

                    ${searchStatus === "reviews"
                        ? "text-slate-900"
                        : "text-slate-500"
                    }
                `}
            >
                수강평
            </Button>

        </div>
    );
}