import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Breadcrumb {
    label: string;
    href?: string;
}

interface StudentPageHeaderProps {
    backHref: string;
    breadcrumbs: Breadcrumb[];
    title: string;
}

export default function StudentPageHeader({
    backHref,
    breadcrumbs,
    title,
}: StudentPageHeaderProps) {
    return (
        <>
            <div className="scrollbar-hidden mb-6 flex items-center gap-2 overflow-x-auto text-sm text-slate-500">
                <Link
                    href={backHref}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg hover:text-slate-900 hover:-translate-y-0.5"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>

                {breadcrumbs.map((breadcrumb, index) => (
                    <div key={`${breadcrumb.label}-${index}`} className="flex shrink-0 items-center gap-2 whitespace-nowrap">
                        {index > 0 && <span>/</span>}

                        {breadcrumb.href ? (
                            <Link href={breadcrumb.href} className="hover:text-slate-900 hover:font-bold">
                                {breadcrumb.label}
                            </Link>
                        ) : (
                            <span className="font-medium text-slate-700">
                                {breadcrumb.label}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            <div className="mb-7 flex justify-between [container-type:inline-size]">
                <div>
                    <h1 className="text-[clamp(1.25rem,4cqw,1.875rem)] font-bold tracking-tight text-slate-950">
                        {title}
                    </h1>
                </div>
            </div>
        </>
    );
}
