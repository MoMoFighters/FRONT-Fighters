import Link from "next/link";

import { AdminReportListItem } from "@/features/report/type";

interface AdminReportItemProps {
    report: AdminReportListItem;
}

export default function AdminReportItem({ report }: AdminReportItemProps) {
    return (
        <Link
            href={`/admin/reports/${report.id}`}
            className="grid min-w-[900px] grid-cols-[2.2fr_.85fr_.9fr_.75fr] items-center px-6 py-4 text-sm transition-colors hover:bg-slate-50/70"
        >
            <div className="min-w-0">
                <div className="flex items-center gap-2">
                    <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
                        {report.reason}
                    </span>
                    <p className="truncate font-medium text-slate-700">
                        {report.detail}
                    </p>
                </div>
            </div>

            <span className="font-medium text-slate-700">
                {report.reporterName}
            </span>

            <time className="text-slate-500">{report.createdAt}</time>

            <div className="flex items-center justify-center">
                <span
                    className={`rounded-md border px-2 py-1 text-xs font-bold ${
                        report.isResolved
                            ? "border-slate-200 bg-slate-50 text-slate-500"
                            : "border-amber-200 bg-amber-50 text-amber-700"
                    }`}
                >
                    {report.isResolved ? "처리 완료" : "미처리"}
                </span>
            </div>
        </Link>
    );
}
