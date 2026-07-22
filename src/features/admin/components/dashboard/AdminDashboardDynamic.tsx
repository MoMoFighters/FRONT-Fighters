'use client'

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const AdminDashboardDynamic = dynamic(
    () => import("./AdminDashboardMonthlyLineChart"),
    {
        loading: () => (
            <section className="mb-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex flex-col items-start gap-6 sm:flex-row sm:justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-80" />
                    </div>

                    <Skeleton className="h-5 w-56" />
                </div>

                <Skeleton className="h-72 w-full rounded-md" />
            </section>
        ),
        ssr: false,
    }
);

export default AdminDashboardDynamic;