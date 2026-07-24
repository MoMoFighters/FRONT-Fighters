"use client";

import { AlertTriangle, CircleAlert, ExternalLink, ShieldCheck, Trash2, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    deleteReportedReviewAction,
    resolveReportAction,
    sanctionReportedUserAction,
} from "@/features/report/action";
import { AdminReportDetail } from "@/features/report/type";

type ReportAction = "SANCTION" | "DISMISS" | "DELETE" | "OPEN_ADMIN" | "OPEN_ORIGINAL";

interface AdminReportActionPanelProps {
    report: AdminReportDetail;
}

const actionCopy: Record<ReportAction, { title: string; description: string; label: string; tone: "indigo" | "rose" }> = {
    SANCTION: {
        title: "신고 처리를 승인할까요?",
        description: "작성자의 제재 누적 횟수에 반영하고 이 신고를 처리 완료로 표시합니다.",
        label: "신고 처리 승인",
        tone: "indigo",
    },
    DISMISS: {
        title: "신고 처리를 기각할까요?",
        description: "이 신고를 처리 완료로 표시하며 작성자 제재 누적 횟수에는 반영하지 않습니다.",
        label: "신고 처리 기각",
        tone: "indigo",
    },
    DELETE: {
        title: "콘텐츠를 삭제할까요?",
        description: "삭제 후에는 해당 콘텐츠를 복구할 수 없습니다. 이 신고는 처리 완료로 표시됩니다.",
        label: "콘텐츠 삭제",
        tone: "rose",
    },
    OPEN_ADMIN: {
        title: "관리자 화면으로 이동할까요?",
        description: "관련 관리자 화면을 열고 이 신고를 처리 완료로 표시합니다.",
        label: "관리자 화면 열기",
        tone: "indigo",
    },
    OPEN_ORIGINAL: {
        title: "원본 사용자 화면으로 이동할까요?",
        description: "원본 사용자 화면을 열고 이 신고를 처리 완료로 표시합니다.",
        label: "원본 화면 열기",
        tone: "indigo",
    },
};

export default function AdminReportActionPanel({
    report,
}: AdminReportActionPanelProps) {
    const [pendingAction, setPendingAction] = useState<ReportAction | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isPageReport = ["LECTURE", "CHAPTER", "POST", "PAGE"].includes(report.targetType);
    const canDeleteContent = report.targetType === "REVIEW" || report.targetType === "COMMENT";
    const isDeleted = Boolean(report.isDeleted);
    const action = pendingAction ? actionCopy[pendingAction] : null;

    const confirmAction = async () => {
        if (!pendingAction) return;

        setIsSubmitting(true);

        try {
            if (pendingAction === "OPEN_ADMIN" && report.adminTargetPath) {
                window.open(report.adminTargetPath, "_blank", "noopener,noreferrer");
                const result = await resolveReportAction(String(report.id));
                result.success ? toast.success(result.message) : toast.error(result.message);
                return;
            }

            if (pendingAction === "OPEN_ORIGINAL" && report.originalPath) {
                window.open(report.originalPath, "_blank", "noopener,noreferrer");
                const result = await resolveReportAction(String(report.id));
                result.success ? toast.success(result.message) : toast.error(result.message);
                return;
            }

            if (pendingAction === "SANCTION") {
                if (!report.reportedUserId) {
                    toast.error("신고 처리를 승인할 사용자 정보가 없습니다.");
                    return;
                }

                const result = await sanctionReportedUserAction({
                    reportId: String(report.id),
                    reportedUserId: String(report.reportedUserId),
                });

                result.success ? toast.success(result.message) : toast.error(result.message);
                return;
            }

            if (pendingAction === "DISMISS") {
                const result = await resolveReportAction(String(report.id));
                result.success ? toast.success(result.message) : toast.error(result.message);
                return;
            }

            if (pendingAction === "DELETE") {
                if (report.targetType === "REVIEW" && report.targetId) {
                    const result = await deleteReportedReviewAction({
                        reportId: String(report.id),
                        reviewId: String(report.targetId),
                    });

                    result.success ? toast.success(result.message) : toast.error(result.message);
                    return;
                }

                toast.error("해당 콘텐츠 삭제 API가 아직 연결되어 있지 않습니다.");
            }
        } finally {
            setIsSubmitting(false);
            setPendingAction(null);
        }
    };

    return (
        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm [container-type:inline-size]">
            <h2 className="text-[clamp(0.875rem,3.5cqw,0.875rem)] font-bold text-slate-950">처리 작업</h2>
            <p className="mt-1 text-[clamp(0.75rem,3cqw,0.75rem)] leading-5 text-slate-500">
                작업을 완료하면 신고 상태가 처리 완료로 변경됩니다.
            </p>

            <div className="mt-4 space-y-2">
                {isPageReport ? (
                    <>
                        {report.adminTargetPath && (
                            <Button
                                type="button"
                                onClick={() => setPendingAction("OPEN_ADMIN")}
                                className="h-9 w-full rounded-md bg-indigo-600 px-3 text-[clamp(0.8125rem,3.2cqw,0.875rem)] font-bold text-white hover:bg-indigo-700"
                            >
                                <ExternalLink className="size-4" />
                                관리자 화면 열기
                            </Button>
                        )}
                    </>
                ) : (
                    <>
                        {!isDeleted && report.reportedUserId && (
                            <Button
                                type="button"
                                onClick={() => setPendingAction("SANCTION")}
                                className="h-9 w-full rounded-md bg-indigo-600 px-3 text-[clamp(0.8125rem,3.2cqw,0.875rem)] font-bold text-white hover:bg-indigo-700"
                            >
                                <ShieldCheck className="size-4" />
                                신고 처리 승인
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setPendingAction("DISMISS")}
                            className="h-9 w-full rounded-md border-slate-200 px-3 text-[clamp(0.8125rem,3.2cqw,0.875rem)] font-bold text-slate-700 hover:bg-slate-50"
                        >
                            <XCircle className="size-4" />
                            신고 처리 기각
                        </Button>
                        {!isDeleted && canDeleteContent && report.targetType !== "CHAT" && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setPendingAction("DELETE")}
                                className="h-9 w-full rounded-md border-rose-200 px-3 text-[clamp(0.8125rem,3.2cqw,0.875rem)] font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                            >
                                <Trash2 className="size-4" />
                                콘텐츠 삭제
                            </Button>
                        )}
                    </>
                )}
            </div>

            <AlertDialog
                open={pendingAction !== null}
                onOpenChange={(open) => !open && setPendingAction(null)}
            >
                <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                        <AlertDialogMedia className={action?.tone === "rose" ? "bg-rose-100 text-rose-600" : "bg-indigo-100 text-indigo-600"}>
                            {action?.tone === "rose" ? <AlertTriangle /> : <CircleAlert />}
                        </AlertDialogMedia>
                        <AlertDialogTitle className="whitespace-pre-line">
                            {action?.title}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="whitespace-pre-line">
                            {action?.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel variant="outline" className="cursor-pointer">
                            취소
                        </AlertDialogCancel>
                        <AlertDialogAction
                            variant="ghost"
                            disabled={isSubmitting}
                            onClick={confirmAction}
                            className={action?.tone === "rose"
                                ? "bg-rose-500 text-white hover:text-white! hover:bg-rose-600!"
                                : "bg-indigo-500 text-white hover:text-white! hover:bg-indigo-600!"}
                        >
                            {action?.label}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </aside>
    );
}
