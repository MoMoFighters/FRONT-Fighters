const pulseBlock = "animate-pulse rounded-xl bg-slate-100";

export function FriendTabSkeleton() {
    return (
        <div className="min-h-0 flex-1 grid grid-cols-1 overflow-hidden md:grid-cols-[3fr_7fr]">
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden border-r border-slate-200 bg-white">
                <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
                    <div className={`h-12 w-12 shrink-0 rounded-full ${pulseBlock}`} />
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <div className={`h-4 w-24 ${pulseBlock}`} />
                        <div className={`h-3 w-16 ${pulseBlock}`} />
                    </div>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className={`h-14 w-full ${pulseBlock}`} />
                    ))}
                </div>
            </div>
            <div className="flex h-full items-center justify-center bg-slate-50">
                <div className={`h-28 w-28 rounded-full ${pulseBlock}`} />
            </div>
        </div>
    );
}

export function RequestTabSkeleton() {
    return (
        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden md:grid-cols-2">
            <div className="flex min-h-0 flex-col gap-4 border-r border-slate-200 bg-slate-50 p-5">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className={`h-14 w-full ${pulseBlock}`} />
                ))}
            </div>
            <div className="flex min-h-0 flex-col gap-4 bg-white p-5">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className={`h-14 w-full ${pulseBlock}`} />
                ))}
            </div>
        </div>
    );
}

export function ChatTabSkeleton() {
    return (
        <div className="grid h-full max-h-full min-h-0 flex-1 grid-cols-1 overflow-hidden md:grid-cols-[3fr_7fr]">
            <div className="flex min-h-0 flex-col gap-3 border-r border-slate-200 bg-white p-4">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className={`h-14 w-full ${pulseBlock}`} />
                ))}
            </div>
            <div className="flex h-full items-center justify-center bg-white">
                <div className={`h-6 w-40 ${pulseBlock}`} />
            </div>
        </div>
    );
}
