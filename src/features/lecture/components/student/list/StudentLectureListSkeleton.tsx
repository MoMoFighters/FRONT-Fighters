import { Skeleton } from "@/components/ui/skeleton";

export default function StudentLectureListSkeleton() {
    return (
        <>
            <div className="mb-4 flex items-center gap-3">
                <Skeleton className="h-12 flex-1 rounded-xl" />
                <Skeleton className="h-12 w-24 rounded-xl" />
            </div>

            <div className="mb-4 flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-[184px_minmax(0,1fr)_160px] items-center gap-6 border-b border-slate-100 p-4 last:border-b-0"
                    >
                        <Skeleton className="h-28 rounded-xl" />

                        <div className="min-w-0">
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="mt-3 h-5 w-3/5" />
                            <Skeleton className="mt-2 h-4 w-full" />
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-6 w-20 rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
