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
            <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
                <Link
                    href={backHref}
                    className="flex h-9 w-9 items-center justify-center rounded-lg hover:text-slate-900 hover:-translate-y-0.5"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>

                {breadcrumbs.map((breadcrumb, index) => (
                    <div key={`${breadcrumb.label}-${index}`} className="flex items-center gap-2">
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

            <div className="mb-7 flex justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                        {title}
                    </h1>
                </div>
            </div>
        </>
    );
}
