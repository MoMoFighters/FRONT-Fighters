import { Skeleton } from "@/components/ui/skeleton";

export default function CommunityFormSkeleton() {
    return (
        <div className="flex min-h-[640px] flex-col rounded-3xl bg-white/90 p-6 shadow-sm ring-1 ring-slate-100">
            <Skeleton className="mb-2 h-7 w-7 rounded-md" />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_180px]">
                <Skeleton className="h-11 rounded-2xl" />
                <Skeleton className="h-11 rounded-2xl" />
            </div>

            <div className="mt-4 flex-1 rounded-2xl border border-slate-200 p-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-3 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-5/6" />
                <Skeleton className="mt-2 h-4 w-2/3" />
            </div>

            <Skeleton className="mt-5 h-11 w-full rounded-2xl" />
        </div>
    );
}
