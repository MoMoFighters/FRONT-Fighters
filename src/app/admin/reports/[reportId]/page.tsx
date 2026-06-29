import Link from "next/link";
import {
    ArrowLeft,
    ExternalLink,
    FileWarning,
    MessageSquareText,
    Monitor,
} from "lucide-react";
import { notFound } from "next/navigation";

import { getReportDetail } from "@/app/services/report/service";
import AdminReportActionPanel from "@/features/report/components/admin/AdminReportActionPanel";
import AdminReportSequenceNavigation from "@/features/report/components/admin/AdminReportSequenceNavigation";
import {
    AdminReportDetail,
    ReportDetail,
    ReportTargetType,
} from "@/features/report/type";

interface AdminReportDetailPageProps {
    params: Promise<{ reportId: string }>;
}

const targetLabels: Record<ReportTargetType, string> = {
    LECTURE: "강의",
    CHAPTER: "챕터",
    POST: "게시글",
    COMMENT: "댓글",
    REVIEW: "수강평",
    CHAT: "채팅",
    PAGE: "페이지",
};

const pageReportTypes: ReportTargetType[] = [
    "LECTURE",
    "CHAPTER",
    "POST",
    "PAGE",
];

const createAdminTargetPath = (report: ReportDetail) => {
    if (!report.targetId) {
        return undefined;
    }

    if (report.targetType === "LECTURE") {
        return `/admin/lectures/${report.targetId}`;
    }

    if (report.targetType === "CHAPTER" && report.parentId) {
        return `/admin/lectures/${report.parentId}/chapters/${report.targetId}`;
    }

    if (report.targetType === "POST") {
        return `/admin/community/${report.targetId}`;
    }

    return undefined;
};

const mapReportDetail = (report: ReportDetail): AdminReportDetail => ({
    id: report.reportId,
    reporterUserId: report.reporterUserId,
    reporterName: report.reporterName,
    reportedUserId: report.reportedUserId,
    reportedName: report.reportedName,
    reason: report.reason,
    detail: report.detail,
    createdAt: report.createdAt,
    isResolved: report.isResolved,
    resolvedAt: report.resolvedAt,
    targetType: report.targetType,
    targetId: report.targetId,
    parentId: report.parentId,
    targetPath: report.targetPath,
    originalPath: report.targetPath,
    adminTargetPath: createAdminTargetPath(report),
    targetAuthorName: report.reportedName,
    targetContent: report.targetContent,
});

export default async function AdminReportDetailPage({
    params,
}: AdminReportDetailPageProps) {
    const { reportId } = await params;
    const parsedReportId = Number(reportId);

    if (!Number.isInteger(parsedReportId) || parsedReportId < 1) {
        notFound();
    }

    const rawReport = await getReportDetail(reportId);
    console.log("[MS-2 신고 상세 조회] raw", rawReport);
    console.log("[MS-2 신고 상세 조회] target content check", {
        reportId: rawReport.reportId,
        targetType: rawReport.targetType,
        targetId: rawReport.targetId,
        parentId: rawReport.parentId,
        targetPath: rawReport.targetPath,
        reportedUserId: rawReport.reportedUserId,
        reportedName: rawReport.reportedName,
        targetContent: rawReport.targetContent,
        targetContentLength: rawReport.targetContent?.length ?? 0,
    });

    const report = mapReportDetail(rawReport);
    const isPageReport = pageReportTypes.includes(report.targetType);

    return (
        <div className="mx-auto w-full max-w-300 pb-10">
            <Link
                href="/admin/reports"
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-950"
            >
                <ArrowLeft className="size-4" />
                신고 목록으로
            </Link>

            <div className="mt-6 flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-950">신고 상세</h1>
                <span className={`rounded-md border px-2 py-1 text-xs font-bold ${
                    report.isResolved
                        ? "border-slate-200 bg-slate-50 text-slate-500"
                        : "border-amber-200 bg-amber-50 text-amber-700"
                }`}>
                    {report.isResolved ? "처리 완료" : "미처리"}
                </span>
                {report.isResolved && report.resolvedAt && (
                    <time className="text-sm font-medium text-slate-400">
                        처리 완료 {report.resolvedAt}
                    </time>
                )}
            </div>

            <div className="mt-7 grid grid-cols-[minmax(0,1fr)_17rem] gap-6">
                <div className="space-y-6">
                    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-2">
                            <FileWarning className="size-5 text-indigo-500" />
                            <h2 className="text-base font-bold text-slate-950">신고 정보</h2>
                        </div>
                        <dl className="mt-5 grid grid-cols-[7rem_minmax(0,1fr)] gap-y-4 text-sm">
                            <dt className="font-bold text-slate-400">신고 사유</dt>
                            <dd className="font-semibold text-slate-800">{report.reason}</dd>
                            <dt className="font-bold text-slate-400">상세 내용</dt>
                            <dd className="leading-6 text-slate-700">{report.detail}</dd>
                            <dt className="font-bold text-slate-400">신고자</dt>
                            <dd className="font-medium text-slate-700">{report.reporterName}</dd>
                            <dt className="font-bold text-slate-400">접수일</dt>
                            <dd className="font-medium text-slate-700">{report.createdAt}</dd>
                        </dl>
                    </section>

                    {isPageReport ? (
                        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-2">
                                <Monitor className="size-5 text-indigo-500" />
                                <h2 className="text-base font-bold text-slate-950">신고된 사용자 화면</h2>
                            </div>

                            <dl className="mt-5 grid grid-cols-[7rem_minmax(0,1fr)] gap-y-4 text-sm">
                                <dt className="font-bold text-slate-400">대상 유형</dt>
                                <dd className="font-semibold text-slate-800">{targetLabels[report.targetType]}</dd>
                                {report.targetId && (
                                    <>
                                        <dt className="font-bold text-slate-400">대상 ID</dt>
                                        <dd className="font-medium text-slate-700">{report.targetId}</dd>
                                    </>
                                )}
                                {report.parentId && (
                                    <>
                                        <dt className="font-bold text-slate-400">상위 ID</dt>
                                        <dd className="font-medium text-slate-700">{report.parentId}</dd>
                                    </>
                                )}
                                <dt className="font-bold text-slate-400">원본 경로</dt>
                                <dd className="break-all font-medium text-slate-700">
                                    {report.originalPath ?? "원본 링크가 제공되지 않았습니다."}
                                </dd>
                            </dl>

                            <div className="mt-5 rounded-md border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm leading-6 text-indigo-700">
                                <ExternalLink className="mr-1 inline size-4" />
                                페이지 단위 신고는 사용자 제재나 콘텐츠 삭제 없이, 원본 사용자 화면과 관리자 화면에서 내용을 확인합니다.
                            </div>
                        </section>
                    ) : (
                        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-2">
                                <MessageSquareText className="size-5 text-indigo-500" />
                                <h2 className="text-base font-bold text-slate-950">신고된 콘텐츠</h2>
                            </div>

                            <dl className="mt-5 grid grid-cols-[7rem_minmax(0,1fr)] gap-y-4 text-sm">
                                <dt className="font-bold text-slate-400">콘텐츠 유형</dt>
                                <dd className="font-semibold text-slate-800">{targetLabels[report.targetType]}</dd>
                                <dt className="font-bold text-slate-400">작성자</dt>
                                <dd className="font-medium text-slate-700">
                                    {report.targetAuthorName ?? "작성자 정보 없음"}
                                </dd>
                                <dt className="font-bold text-slate-400">콘텐츠 내용</dt>
                                <dd className="rounded-md bg-slate-50 p-4 leading-7 text-slate-700">
                                    {report.targetContent ?? "백엔드에서 신고 콘텐츠 내용을 내려주지 않았습니다."}
                                </dd>
                            </dl>
                        </section>
                    )}
                </div>

                <AdminReportActionPanel report={report} />
            </div>

            <div className="mt-6">
                <AdminReportSequenceNavigation current={report} />
            </div>
        </div>
    );
}
