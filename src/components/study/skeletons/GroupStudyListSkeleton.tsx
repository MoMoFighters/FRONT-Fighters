import { Skeleton } from "@/components/ui/skeleton";

export default function GroupStudyListSkeleton() {
    return (
        <main className="min-h-[calc(100vh-137px)] bg-white px-4 py-8 sm:px-8 sm:py-12">
            <div className="mx-auto flex w-full max-w-240 flex-col gap-8">
                <div>
                    <Skeleton className="h-8 w-40" />
                    <Skeleton className="mt-2 h-4 w-72" />
                </div>

                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {Array.from({ length: 2 }).map((_, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                            <Skeleton className="h-11 w-11 shrink-0 rounded-2xl" />
                            <div className="flex-1">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="mt-2 h-6 w-20" />
                            </div>
                        </div>
                    ))}
                </section>

                <div className="flex items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <Skeleton className="h-10 w-32 rounded-xl" />
                    <Skeleton className="h-10 w-40 rounded-xl" />
                </div>

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <Skeleton className="h-5 w-28" />

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="rounded-2xl border border-slate-200 p-5"
                            >
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="mt-2 h-3 w-48" />
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
