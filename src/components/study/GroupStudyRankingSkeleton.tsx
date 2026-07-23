import { Skeleton } from "@/components/ui/skeleton";

export default function GroupStudyRankingSkeleton() {
    return (
        <aside className="w-full shrink-0 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:w-56">
            <Skeleton className="h-8 w-full rounded-full" />

            <div className="mt-6 flex items-end justify-center gap-2">
                <Skeleton className="h-20 w-14 rounded-xl" />
                <Skeleton className="h-24 w-14 rounded-xl" />
                <Skeleton className="h-16 w-14 rounded-xl" />
            </div>

            <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton
                        key={index}
                        className="h-8 w-full rounded-lg"
                    />
                ))}
            </div>
        </aside>
    );
}
