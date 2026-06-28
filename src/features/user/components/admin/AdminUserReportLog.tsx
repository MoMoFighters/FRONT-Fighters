import {
    BookOpen,
    CheckCircle2,
    FileText,
    MessageCircle,
    MessageSquareText,
    Monitor,
    PlaySquare,
    Star,
} from "lucide-react";

import { TargetType } from "@/features/report/type";
import { ReportByUser } from "@/features/user/type";

const TARGET_TYPE_META: Record<TargetType, {
    label: string;
    Icon: typeof MessageSquareText;
}> = {
    LECTURE: {
        label: "강의",
        Icon: BookOpen,
    },
    CHAPTER: {
        label: "챕터",
        Icon: PlaySquare,
    },
    POST: {
        label: "게시글",
        Icon: FileText,
    },
    REVIEW: {
        label: "수강평",
        Icon: Star,
    },
    COMMENT: {
        label: "댓글",
        Icon: MessageSquareText,
    },
    CHAT: {
        label: "채팅",
        Icon: MessageCircle,
    },
    PAGE: {
        label: "페이지",
        Icon: Monitor,
    },
};

interface AdminUserReportLogProps {
    reports: ReportByUser[];
}

const formatAdminDateTime = (dateTime: string) => {
    return dateTime.replace("T", " ").slice(0, 16);
};

export default function AdminUserReportLog({ reports }: AdminUserReportLogProps) {
    return (
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="text-base font-bold text-slate-950">신고 이력</h2>
                <p className="mt-1 text-sm font-medium text-slate-500">동일한 콘텐츠의 중복 신고 여부를 확인한 뒤 처리합니다.</p>
            </div>

            {reports.length === 0 ? (
                <div className="flex h-48 items-center justify-center text-sm font-bold text-slate-400">
                    신고 이력이 없습니다.
                </div>
            ) : (
                <div className="divide-y divide-slate-100">
                    {reports.map((report, index) => {
                        const meta = TARGET_TYPE_META[report.targetType];
                        const Icon = meta.Icon;

                        return (
                            <article key={`${report.targetType}-${report.createdAt}-${index}`} className="flex items-center gap-4 px-6 py-4">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600"><Icon className="size-4" /></div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2"><span className="text-sm font-bold text-slate-800">{meta.label}</span><span className="text-xs font-medium text-slate-400">{formatAdminDateTime(report.createdAt)}</span></div>
                                    <p className="mt-1 truncate text-sm text-slate-500">
                                        {report.content ?? "직접 해당 페이지에서 내용을 확인해주세요."}
                                    </p>
                                </div>
                                <span className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-bold ${report.isResolved ? "bg-slate-100 text-slate-600" : "bg-amber-50 text-amber-700"}`}>
                                    {report.isResolved && <CheckCircle2 className="size-3.5" />}
                                    {report.isResolved ? "처리 완료" : "미처리"}
                                </span>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
