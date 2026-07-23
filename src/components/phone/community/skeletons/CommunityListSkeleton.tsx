import { Skeleton } from "@/components/ui/skeleton";
import CommunityPageHeader from "@/components/phone/community/CommunityPageHeader";
import CommunitySideBar from "@/components/phone/community/CommunitySideBar";
import type { CommunityAuthorRole } from "@/features/community/type";

export default function CommunityListSkeleton({
    role,
}: {
    role?: CommunityAuthorRole;
}) {
    return (
        <div className="flex h-full min-h-0 flex-col overflow-hidden bg-white">
            <div className="mx-auto flex h-full min-h-0 w-full max-w-360 flex-col overflow-hidden px-4 py-8 md:px-12 md:py-12">
                <CommunityPageHeader role={role} />

                {role !== "ADMIN" && role !== "GUEST" && (
                    <div className="shrink-0">
                        <CommunitySideBar role={role === "STUDENT" ? undefined : role} />
                    </div>
                )}

                <section className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
                    <header className="shrink-0">
                        <div className="flex items-center justify-between gap-4">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-10 w-40 rounded-2xl" />
                        </div>

                        <div className="mt-5 flex items-center gap-3">
                            <Skeleton className="h-12 flex-1 rounded-xl" />
                            <Skeleton className="h-12 w-32 rounded-xl" />
                            <Skeleton className="h-12 w-24 rounded-xl" />
                        </div>
                    </header>

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
