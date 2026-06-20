import { CheckCircle2, MessageSquareText, Star } from "lucide-react";

interface AdminUserReportLogItem {
    id: number;
    type: "커뮤니티 댓글" | "수강평";
    content: string;
    reportedAt: string;
    isProcessed: boolean;
}

interface AdminUserReportLogProps {
    reports: AdminUserReportLogItem[];
}

export default function AdminUserReportLog({ reports }: AdminUserReportLogProps) {
    return (
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="text-base font-bold text-slate-950">신고 이력</h2>
                <p className="mt-1 text-sm font-medium text-slate-500">동일한 콘텐츠의 중복 신고 여부를 확인한 뒤 처리합니다.</p>
            </div>
            <div className="divide-y divide-slate-100">
                {reports.map((report) => {
                    const Icon = report.type === "커뮤니티 댓글" ? MessageSquareText : Star;

                    return (
                        <article key={report.id} className="flex items-center gap-4 px-6 py-4">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600"><Icon className="size-4" /></div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2"><span className="text-sm font-bold text-slate-800">{report.type}</span><span className="text-xs font-medium text-slate-400">{report.reportedAt}</span></div>
                                <p className="mt-1 truncate text-sm text-slate-500">{report.content}</p>
                            </div>
                            <span className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-bold ${report.isProcessed ? "bg-slate-100 text-slate-600" : "bg-amber-50 text-amber-700"}`}>
                                {report.isProcessed && <CheckCircle2 className="size-3.5" />}
                                {report.isProcessed ? "처리 완료" : "미처리"}
                            </span>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
