import { Skeleton } from "@/components/ui/skeleton";

export default function GuestLectureListSkeleton() {
    return (
        <>
            <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="mt-2 h-4 w-48" />
                    </div>

                    <div className="flex w-full max-w-md items-center gap-2">
                        <Skeleton className="h-10 flex-1 rounded-lg" />
                        <Skeleton className="h-10 w-16 rounded-lg" />
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <Skeleton
                            key={index}
                            className="h-8 w-14 rounded-full"
                        />
                    ))}
                </div>
            </div>

            <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-1 items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 md:grid-cols-[144px_minmax(0,1fr)_120px] md:gap-5"
                    >
                        <Skeleton className="h-21 rounded-sm" />

                        <div className="min-w-0">
                            <div className="mb-2 flex items-center gap-2">
                                <Skeleton className="h-5 w-12 rounded-sm" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                            <Skeleton className="h-5 w-3/5" />
                            <Skeleton className="mt-2 h-4 w-full" />
                            <Skeleton className="mt-2 h-4 w-4/5" />
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
