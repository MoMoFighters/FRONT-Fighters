import Link from "next/link";
import { ArrowLeft, FileWarning, MessageSquareText, Monitor, Trash2 } from "lucide-react";
import { notFound } from "next/navigation";

import AdminReportActionPanel from "@/features/report/components/admin/AdminReportActionPanel";
import AdminReportSequenceNavigation from "@/features/report/components/admin/AdminReportSequenceNavigation";
import { AdminReportDetail, ReportTargetType } from "@/features/report/type";

interface AdminReportDetailPageProps {
    params: Promise<{ reportId: string }>;
}

const REPORT_LIMIT = 24;

const targetLabels: Record<ReportTargetType, string> = {
    COMMENT: "댓글",
    REVIEW: "수강평",
    CHAT: "채팅",
    PAGE: "페이지",
};

const createDummyReport = (id: number): AdminReportDetail => {
    const variant = ((id - 1) % 5) + 1;
    const base = {
        id,
        reporterName: ["김하늘", "이민지", "박서준", "최유진", "정민우"][variant - 1],
        createdAt: `2026-06-${String(21 - Math.floor((id - 1) / 3)).padStart(2, "0")} ${String(17 - ((id - 1) % 6)).padStart(2, "0")}:20`,
        isResolved: id % 3 === 0,
    };

    if (variant === 4) {
        return {
            ...base,
            reason: "기타",
            detail: "강의 소개 화면의 안내 문구가 실제 내용과 다릅니다.",
            resolvedAt: base.isResolved ? "2026-06-20 14:22" : undefined,
            targetType: "PAGE",
            adminTargetPath: "/admin/lectures",
            originalPath: "/student/study/lectures/6",
        };
    }

    if (variant === 5) {
        return {
            ...base,
            reason: "기타",
            detail: "마이페이지에서 불편한 동작을 확인했습니다.",
            resolvedAt: base.isResolved ? "2026-06-20 14:22" : undefined,
            targetType: "PAGE",
            originalPath: "/student/mypage",
        };
    }

    const targetType = (["COMMENT", "REVIEW", "CHAT"] as const)[variant - 1];
    const isDeleted = id === 3;

    return {
        ...base,
        reason: variant === 1 ? "부적절한 내용" : variant === 2 ? "홍보성" : "도배성",
        detail: variant === 1
            ? "수강생을 비하하는 댓글이 반복해서 작성되었습니다."
            : variant === 2
                ? "외부 서비스 가입을 유도하는 링크가 포함되어 있습니다."
                : "동일한 메시지가 채팅방에 여러 번 전송되었습니다.",
        resolvedAt: base.isResolved ? "2026-06-20 14:22" : undefined,
        targetType,
        targetId: 100 + id,
        targetAuthorName: variant === 1 ? "김모모" : variant === 2 ? "이수강" : "박채팅",
        targetContent: variant === 1
            ? "초보면 이런 강의는 듣지 마세요. 시간 낭비입니다. 기본적인 내용도 제대로 설명하지 못하네요."
            : variant === 2
                ? "더 좋은 강의를 찾고 있다면 제 프로필의 외부 채널을 확인해 보세요. 특별 할인도 안내드립니다."
                : "같은 내용의 메시지를 짧은 시간 안에 반복해서 전송하고 있습니다.",
        targetDeleted: isDeleted,
        targetDeletedAt: isDeleted ? "2026-06-20 09:14" : undefined,
    };
};

export default async function AdminReportDetailPage({
    params,
}: AdminReportDetailPageProps) {
    const { reportId } = await params;
    const parsedReportId = Number(reportId);

    if (!Number.isInteger(parsedReportId) || parsedReportId < 1 || parsedReportId > REPORT_LIMIT) {
        notFound();
    }

    // TODO: 신고 상세 조회 API 응답과 이전/다음 신고 ID를 받아 더미 데이터를 교체한다.
    const report = createDummyReport(parsedReportId);
    const previous = parsedReportId > 1 ? createDummyReport(parsedReportId - 1) : undefined;
    const next = parsedReportId < REPORT_LIMIT ? createDummyReport(parsedReportId + 1) : undefined;
    const isPageReport = report.targetType === "PAGE";

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
                                <h2 className="text-base font-bold text-slate-950">신고된 페이지</h2>
                            </div>
                            {report.adminTargetPath ? (
                                <p className="mt-4 text-sm leading-6 text-slate-600">
                                    관리자 화면에서 확인 가능한 페이지 신고입니다. 오른쪽의 관리자 화면 열기 버튼으로 이동해 내용을 검토할 수 있습니다.
                                </p>
                            ) : (
                                <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-sm font-bold text-slate-700">관리자용 확인 화면 없음</p>
                                    <p className="mt-1 text-sm leading-6 text-slate-500">
                                        개인화된 사용자 화면에 대한 신고입니다. 현재 관리자 도메인에서 확인할 대상이 없어 제재하지 않음으로 처리할 수 있습니다.
                                    </p>
                                </div>
                            )}
                        </section>
                    ) : (
                        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-2">
                                <MessageSquareText className="size-5 text-indigo-500" />
                                <h2 className="text-base font-bold text-slate-950">신고된 콘텐츠</h2>
                            </div>

                            {report.targetDeleted && (
                                <div className="mt-4 flex items-start gap-2 rounded-md border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                    <Trash2 className="mt-0.5 size-4 shrink-0" />
                                    <p>
                                        이미 삭제된 콘텐츠입니다.
                                        {report.targetDeletedAt && ` 삭제일 ${report.targetDeletedAt}`}
                                    </p>
                                </div>
                            )}

                            <dl className="mt-5 grid grid-cols-[7rem_minmax(0,1fr)] gap-y-4 text-sm">
                                <dt className="font-bold text-slate-400">콘텐츠 유형</dt>
                                <dd className="font-semibold text-slate-800">{targetLabels[report.targetType]}</dd>
                                <dt className="font-bold text-slate-400">작성자</dt>
                                <dd className="font-medium text-slate-700">{report.targetAuthorName}</dd>
                                <dt className="font-bold text-slate-400">콘텐츠 내용</dt>
                                <dd className="rounded-md bg-slate-50 p-4 leading-7 text-slate-700">
                                    {report.targetContent}
                                </dd>
                            </dl>
                        </section>
                    )}
                </div>

                <AdminReportActionPanel report={report} />
            </div>

            <div className="mt-6">
                <AdminReportSequenceNavigation
                    previous={previous}
                    current={report}
                    next={next}
                />
            </div>
        </div>
    );
}
