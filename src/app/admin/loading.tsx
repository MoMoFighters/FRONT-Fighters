import Image from "next/image";

import loading from "@/app/assets/img/loading.png";
import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
    return (
        <div className="relative min-h-[calc(100vh-136px)] w-full">
            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4">
                <div className="relative h-22 w-25">
                    <Image
                        src={loading}
                        alt="Loading"
                        fill
                        className="-scale-x-100"
                    />
                </div>

                <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                    <Spinner className="size-4" />
                    <span>불러오는 중...</span>
                </div>
            </div>
        </div>
    );
}