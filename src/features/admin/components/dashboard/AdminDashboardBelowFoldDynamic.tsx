"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import {
    AdminDashboardAccessLog,
    AdminDashboardMonthlyDatum,
    AdminDashboardMonthlyRevenueDatum,
    AdminDashboardNotice,
    AdminDashboardReport,
    AdminDashboardSystemStatus,
    AdminDashboardTask,
} from "./type";

interface AdminDashboardBelowFoldDynamicProps {
    monthlySubDashboardData: AdminDashboardMonthlyDatum[];
    monthlyRevenueData: AdminDashboardMonthlyRevenueDatum[];
    pendingTasks: AdminDashboardTask[];
    notices: AdminDashboardNotice[];
    reports: AdminDashboardReport[];
    accessLogs: AdminDashboardAccessLog[];
    systemStatuses: AdminDashboardSystemStatus[];
}

const AdminDashboardBelowFoldContent = dynamic(
    () => import("./AdminDashboardBelowFoldContent"),
    {
        loading: () => <AdminDashboardBelowFoldSkeleton />,
        ssr: false,
    }
);

function AdminDashboardBelowFoldSkeleton() {
    return (
        <div className="space-y-5">
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-start justify-between gap-6">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-72" />
                    </div>
                    <Skeleton className="h-5 w-56" />
                </div>
                <Skeleton className="h-80 w-full rounded-md" />
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-start justify-between gap-6">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-56" />
                        <Skeleton className="h-4 w-80" />
                    </div>
                    <Skeleton className="h-5 w-64" />
                </div>
                <Skeleton className="h-80 w-full rounded-md" />
            </section>

            <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(440px,0.96fr)] gap-5">
                <Skeleton className="h-96 rounded-lg" />
                <div className="space-y-5">
                    <Skeleton className="h-56 rounded-lg" />
                    <Skeleton className="h-40 rounded-lg" />
                </div>
            </div>
        </div>
    );
}

export default function AdminDashboardBelowFoldDynamic(props: AdminDashboardBelowFoldDynamicProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const target = containerRef.current;

        if (!target || isVisible) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: "160px 0px",
                threshold: 0.1,
            }
        );

        observer.observe(target);

        return () => {
            observer.disconnect();
        };
    }, [isVisible]);

    return (
        <div ref={containerRef}>
            {isVisible ? (
                <AdminDashboardBelowFoldContent {...props} />
            ) : (
                <AdminDashboardBelowFoldSkeleton />
            )}
        </div>
    );
}
