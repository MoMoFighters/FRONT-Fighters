import { AdminReportListItem } from "@/features/report/type";
import AdminReportItem from "./AdminReportItem";

interface AdminReportListProps {
    reports: AdminReportListItem[];
}

export default function AdminReportList({ reports }: AdminReportListProps) {
    return (
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="hidden border-b border-slate-200 bg-slate-50 px-6 py-3 text-xs font-bold text-slate-500 md:grid md:min-w-[900px] md:grid-cols-[2.2fr_.85fr_.9fr_.75fr]">
                <span>신고 사유</span>
                <span>신고자</span>
                <span>접수일</span>
                <span className="text-center">처리 상태</span>
            </div>

            <div className="divide-y divide-slate-100">
                {reports.map((report) => (
                    <AdminReportItem key={report.id} report={report} />
                ))}
            </div>
        </section>
    );
}
