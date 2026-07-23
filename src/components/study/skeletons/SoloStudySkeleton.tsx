import { Skeleton } from "@/components/ui/skeleton";

export default function SoloStudySkeleton() {
    return (
        <main className="min-h-[calc(100vh-137px)] bg-white px-4 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto w-full max-w-360">
                <div className="mb-6 flex items-center gap-2">
                    <Skeleton className="h-9 w-9 rounded-lg" />
                    <Skeleton className="h-4 w-48" />
                </div>

                <Skeleton className="mb-7 h-8 w-40" />
            </div>

            <div className="mx-auto mt-8 flex w-full max-w-360 flex-col items-stretch gap-8 lg:flex-row lg:items-start lg:justify-center">
                <aside className="flex w-full flex-col items-center gap-4 lg:w-64 lg:shrink-0">
                    <Skeleton className="h-20 w-full rounded-2xl" />
                    <Skeleton className="h-40 w-full rounded-2xl" />
                    <Skeleton className="h-24 w-full rounded-2xl" />
                </aside>

                <section className="flex w-full flex-col items-center lg:max-w-100">
                    <div className="w-full rounded-2xl border border-slate-300 bg-white py-4 text-center shadow-sm">
                        <Skeleton className="mx-auto h-6 w-40" />
                        <Skeleton className="mx-auto mt-2 h-3 w-56" />
                    </div>

                    <div className="mt-10 w-full max-w-96">
                        <div className="flex items-center justify-end gap-2 px-1">
                            <Skeleton className="h-7 w-7 rounded-lg" />
                            <Skeleton className="h-7 w-7 rounded-lg" />
                        </div>
                        <Skeleton className="mt-2 aspect-video w-full rounded-2xl" />
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
