import { ShieldAlert } from "lucide-react";
import { AdminDashboardReport } from "./type";

const STATUS_CLASS = {
    "처리": "bg-slate-50 text-slate-600",
    "미처리": "bg-amber-50 text-amber-500",
};

export default function AdminDashboardReportList({
    reports,
}: {
    reports: AdminDashboardReport[];
}) {
    return (
        <div className="divide-y divide-slate-100 px-5">
            {reports.map((report) => (
                <div key={report.id} className="grid grid-cols-[24px_minmax(0,1fr)_92px_112px_54px] items-center gap-3 py-3">
                    <ShieldAlert className="h-5 w-5 text-rose-500" />

                    <p className="truncate text-xs font-black text-slate-800">
                        {report.title}
                    </p>

                    <span className="text-xs font-bold text-slate-500">
                        {report.reporter}
                    </span>

                    <span className="text-xs font-bold text-slate-400">
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
