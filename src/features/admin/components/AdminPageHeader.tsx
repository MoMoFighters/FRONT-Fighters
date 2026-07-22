interface AdminPageHeaderProps {
    title: string;
    description?: string;
    badge?: string;
}

export default function AdminPageHeader({
    title,
    description,
    badge,
}: AdminPageHeaderProps) {
    return (
        <div className="mb-8 flex flex-col items-start gap-6 sm:flex-row sm:justify-between">
            <div>
                <div className="flex items-center gap-3">
                    <div className="h-7 w-1.5 rounded-full bg-indigo-400" />

                    <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                        {title}
                    </h1>
                </div>

                {description && (
                    <p className="mt-3 text-sm font-medium text-slate-500">
                        {description}
                    </p>
                )}
            </div>

            {badge && (
                <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-500">
                    {badge}
                </span>
            )}
        </div>
    );
}
