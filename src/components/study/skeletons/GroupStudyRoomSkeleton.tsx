import { Skeleton } from "@/components/ui/skeleton";
import GroupStudyRankingSkeleton from "@/components/study/GroupStudyRankingSkeleton";

export default function GroupStudyRoomSkeleton() {
    return (
        <main className="min-h-[calc(100vh-137px)] bg-white px-4 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto w-full max-w-360">
                <div className="mb-6 flex items-center gap-2">
                    <Skeleton className="h-9 w-9 rounded-lg" />
                    <Skeleton className="h-4 w-40" />
                </div>

                <Skeleton className="mb-7 h-8 w-56" />
            </div>

            <div className="mx-auto mt-8 flex w-full max-w-360 flex-col items-stretch gap-8 lg:flex-row lg:items-start lg:justify-center">
                <GroupStudyRankingSkeleton />

                <section className="flex w-full flex-col lg:max-w-125">
                    <div className="rounded-2xl border border-slate-300 bg-white py-4 text-center shadow-sm">
                        <Skeleton className="mx-auto h-6 w-40" />
                        <Skeleton className="mx-auto mt-2 h-3 w-32" />
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 md:grid-cols-2">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="pt-7">
                                <Skeleton className="h-24 w-full rounded-2xl sm:h-28" />
                                <Skeleton className="mt-2 h-7 w-full rounded-lg" />
                            </div>
                        ))}
                    </div>
                </section>

                <div className="flex shrink-0 flex-col items-center rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
                    <Skeleton className="mb-8 h-7 w-24" />
                    <Skeleton className="h-48 w-48 rounded-full sm:h-64 sm:w-64" />

                    <div className="mt-8 flex items-center gap-5">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <Skeleton className="h-12 w-12 rounded-full" />
                    </div>
                </div>
            </div>
        </main>
    );
}
