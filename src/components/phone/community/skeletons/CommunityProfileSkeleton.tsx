import { Skeleton } from "@/components/ui/skeleton";
import CommunityPageHeader from "@/components/phone/community/CommunityPageHeader";
import CommunitySideBar from "@/components/phone/community/CommunitySideBar";

export default function CommunityProfileSkeleton({
    role,
}: {
    role?: "TEACHER" | "ADMIN";
}) {
    return (
        <div className="flex h-full min-h-0 flex-col overflow-hidden bg-white">
            <div className="mx-auto flex h-full min-h-0 w-full max-w-360 flex-col overflow-hidden px-4 py-8 md:px-12 md:py-12">
                <CommunityPageHeader role={role} />

                <div className="shrink-0">
                    <CommunitySideBar role={role} />
                </div>

                <section className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
                    <div className="shrink-0 rounded-3xl bg-white/90 p-6 shadow-sm ring-1 ring-slate-100">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 items-center gap-3">
                                <Skeleton className="h-16 w-16 rounded-2xl" />

                                <div>
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="mt-2 h-5 w-16 rounded-full" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-slate-100 bg-slate-50/80 sm:flex-1 sm:grid-cols-4">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="px-3 py-3 text-center"
                                    >
                                        <Skeleton className="mx-auto h-3 w-10" />
                                        <Skeleton className="mx-auto mt-2 h-5 w-8" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex shrink-0 items-center justify-between gap-3">
                        <div>
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="mt-1.5 h-3 w-20" />
                        </div>

                        <Skeleton className="h-9 w-40 rounded-2xl" />
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <Skeleton
                                key={index}
                                className="aspect-square rounded-2xl"
                            />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
