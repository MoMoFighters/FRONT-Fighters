import { ShieldAlert } from "lucide-react";

export interface AdminDashboardReport {
    id: number;
    title: string;
    reporter: string;
    reportedAt: string;
    status: "대기" | "긴급";
}

const STATUS_CLASS = {
    "대기": "bg-amber-50 text-amber-600",
    "긴급": "bg-rose-50 text-rose-500",
};

export default function AdminDashboardReportList({
    reports,
}: {
    reports: AdminDashboardReport[];
}) {
    return (
        <div className="divide-y divide-slate-100 px-5">
            {reports.map((report) => (
                <div key={report.id} className="grid grid-cols-[24px_minmax(0,1fr)_92px_112px_54px] items-center gap-3 py-4">
                    <ShieldAlert className="h-5 w-5 text-rose-500" />

                    <p className="truncate text-xs font-black text-slate-800">
                        {report.title}
                    </p>

                    <span className="text-xs font-semibold text-slate-500">
                        {report.reporter}
                    </span>

                    <span className="text-xs font-semibold text-slate-400">
                        {report.reportedAt}
                    </span>

                    <span className={`rounded-md px-2 py-1 text-center text-xs font-black ${STATUS_CLASS[report.status]}`}>
                        {report.status}
                    </span>
                </div>
            ))}
        </div>
    );
}
