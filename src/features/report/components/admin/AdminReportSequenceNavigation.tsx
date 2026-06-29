import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";

import { AdminReportListItem } from "@/features/report/type";

interface AdminReportSequenceNavigationProps {
    previous?: AdminReportListItem;
    current: AdminReportListItem;
    next?: AdminReportListItem;
}

interface SequenceItemProps {
    label: string;
    report: AdminReportListItem;
    isCurrent?: boolean;
    icon?: "up" | "down";
}

const formatAdminDateTime = (dateTime: string) => {
    return dateTime.replace("T", " ").slice(0, 16);
};

function SequenceItem({ label, report, isCurrent = false, icon }: SequenceItemProps) {
    return (
        <Link
            href={`/admin/reports/${report.id}`}
            aria-current={isCurrent ? "page" : undefined}
            className={`grid grid-cols-[5rem_minmax(0,1fr)_8rem] items-center gap-4 px-5 py-4 text-sm transition-colors ${
                isCurrent
                    ? "bg-indigo-50/70"
                    : "hover:bg-slate-50"
            }`}
        >
            <span className={`inline-flex items-center gap-1 text-xs font-bold ${
                isCurrent ? "text-indigo-600" : "text-slate-400"
            }`}>
                {icon === "up" && <ChevronUp className="size-3.5" />}
                {icon === "down" && <ChevronDown className="size-3.5" />}
                {label}
            </span>
            <span className="min-w-0 truncate font-medium text-slate-700">
                <span className="mr-2 text-slate-400">{report.reason}</span>
                {report.detail}
            </span>
            <time className="text-right text-xs font-medium text-slate-400">
                {formatAdminDateTime(report.createdAt)}
            </time>
        </Link>
    );
}

export default function AdminReportSequenceNavigation({
    previous,
    current,
    next,
}: AdminReportSequenceNavigationProps) {
    return (
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="text-sm font-bold text-slate-950">신고 목록</h2>
            </div>
            <div className="divide-y divide-slate-100">
                {previous && <SequenceItem label="이전 신고" report={previous} icon="up" />}
                <SequenceItem label="현재 신고" report={current} isCurrent />
                {next && <SequenceItem label="다음 신고" report={next} icon="down" />}
            </div>
        </section>
    );
}
