import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import type { CommunityAuthorRole } from "@/features/community/type";

const HOME_HREF_BY_ROLE: Partial<Record<CommunityAuthorRole, string>> = {
    TEACHER: "/teacher",
    ADMIN: "/admin",
    GUEST: "/",
};

export default function CommunityPageHeader({
    role,
}: {
    role?: CommunityAuthorRole;
}) {
    const homeHref = HOME_HREF_BY_ROLE[role ?? "STUDENT"] ?? "/student";

    return (
        <div className="shrink-0">
            <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
                <Link
                    href={homeHref}
                    className="flex h-9 w-9 items-center justify-center rounded-lg hover:-translate-y-0.5 hover:text-slate-900"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>

                <Link
                    href={homeHref}
                    className="hover:font-bold hover:text-slate-900"
                >
                    홈
                </Link>
                <span>/</span>
                <span className="font-medium text-slate-700">
                    커뮤니티
                </span>
            </div>

            <div className="mb-7 flex justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
                    커뮤니티
                </h1>
            </div>
        </div>
    );
}
