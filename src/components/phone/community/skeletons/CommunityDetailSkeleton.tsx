import { Skeleton } from "@/components/ui/skeleton";
import CommunityPageHeader from "@/components/phone/community/CommunityPageHeader";
import type { CommunityAuthorRole } from "@/features/community/type";

export default function CommunityDetailSkeleton({
    role,
}: {
    role?: CommunityAuthorRole;
}) {
    return (
        <div className="min-h-[calc(100vh-137px)] bg-white">
            <div className="mx-auto w-full max-w-360 px-4 py-8 md:px-12 md:py-12">
                <CommunityPageHeader role={role} />

                <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[7fr_3fr]">
                    <article className="flex min-h-[591px] flex-col rounded-3xl bg-white/90 p-6 shadow-sm ring-1 ring-slate-100">
                        <div className="w-full border-b border-slate-100 pb-3">
                            <div className="flex items-center justify-between gap-3">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-6 w-12 rounded-md" />
                            </div>

                            <Skeleton className="mt-3 h-6 w-2/3" />

                            <div className="mt-3 flex items-center gap-3">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <div>
                                    <Skeleton className="h-3.5 w-20" />
                                    <Skeleton className="mt-1.5 h-3 w-12" />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 py-5">
                            <Skeleton className="h-64 w-full rounded-2xl" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </article>

                    <div className="flex min-h-[591px] flex-col lg:sticky lg:top-8">
                        <div className="flex flex-1 flex-col rounded-3xl bg-white/90 p-6 shadow-sm ring-1 ring-slate-100">
                            <Skeleton className="mb-5 h-11 w-full rounded-2xl" />

                            {Array.from({ length: 4 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="mb-3 flex items-start gap-2 border-b border-slate-100 py-3"
                                >
                                    <Skeleton className="h-8 w-8 shrink-0 rounded-md" />
                                    <div className="min-w-0 flex-1">
                                        <Skeleton className="h-3.5 w-20" />
                                        <Skeleton className="mt-2 h-3.5 w-full" />
                                        <Skeleton className="mt-1.5 h-3.5 w-2/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
