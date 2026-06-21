"use client";

import { ExternalLink, ShieldCheck, Trash2, XCircle } from "lucide-react";
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
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AdminReportDetail } from "@/features/report/type";

type ReportAction = "SANCTION" | "DISMISS" | "DELETE" | "OPEN_PAGE";

interface AdminReportActionPanelProps {
    report: AdminReportDetail;
}

const actionCopy: Record<ReportAction, { title: string; description: string; label: string; tone: "indigo" | "rose" }> = {
    SANCTION: {
        title: "제재 처리할까요?",
        description: "작성자의 제재 누적 횟수에 반영하고 이 신고를 처리 완료로 표시합니다.",
        label: "제재 처리",
        tone: "indigo",
    },
    DISMISS: {
        title: "제재하지 않고 처리할까요?",
        description: "이 신고를 처리 완료로 표시하며 작성자 제재 누적 횟수에는 반영하지 않습니다.",
        label: "제재하지 않음",
        tone: "indigo",
    },
    DELETE: {
        title: "콘텐츠를 삭제할까요?",
        description: "삭제 후에는 해당 콘텐츠를 복구할 수 없습니다. 이 신고는 처리 완료로 표시됩니다.",
        label: "콘텐츠 삭제",
        tone: "rose",
    },
    OPEN_PAGE: {
        title: "관리자 화면으로 이동할까요?",
        description: "이 신고를 처리 완료로 표시한 뒤 관련 관리자 화면으로 이동합니다.",
        label: "화면 열기",
        tone: "indigo",
    },
};

export default function AdminReportActionPanel({
    report,
}: AdminReportActionPanelProps) {
    const [pendingAction, setPendingAction] = useState<ReportAction | null>(null);
    const isPageReport = report.targetType === "PAGE";
    const isDeleted = Boolean(report.targetDeleted);
    const action = pendingAction ? actionCopy[pendingAction] : null;

    const confirmAction = () => {
        if (!pendingAction) return;

        // TODO: 신고 처리 API와 콘텐츠/회원 제재 API가 준비되면 액션별 요청을 연결한다.
        if (pendingAction === "OPEN_PAGE" && report.adminTargetPath) {
            window.location.assign(report.adminTargetPath);
            return;
        }

        toast.info("신고 처리 API가 준비되면 이 작업이 저장됩니다.");
        setPendingAction(null);
    };

    return (
        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-950">처리 작업</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">
                작업을 완료하면 신고 상태가 처리 완료로 변경됩니다.
            </p>

            <div className="mt-4 space-y-2">
                {isPageReport ? (
                    report.adminTargetPath ? (
                        <Button
                            type="button"
                            onClick={() => setPendingAction("OPEN_PAGE")}
                            className="h-9 w-full rounded-md bg-indigo-600 px-3 text-sm font-bold text-white hover:bg-indigo-700"
                        >
                            <ExternalLink className="size-4" />
                            관리자 화면 열기
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setPendingAction("DISMISS")}
                            className="h-9 w-full rounded-md border-slate-200 px-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                        >
                            <XCircle className="size-4" />
                            제재하지 않음
                        </Button>
                    )
                ) : (
                    <>
                        {!isDeleted && (
                            <Button
                                type="button"
                                onClick={() => setPendingAction("SANCTION")}
                                className="h-9 w-full rounded-md bg-indigo-600 px-3 text-sm font-bold text-white hover:bg-indigo-700"
                            >
                                <ShieldCheck className="size-4" />
                                제재 처리
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setPendingAction("DISMISS")}
                            className="h-9 w-full rounded-md border-slate-200 px-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                        >
                            <XCircle className="size-4" />
                            제재하지 않음
                        </Button>
                        {!isDeleted && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setPendingAction("DELETE")}
                                className="h-9 w-full rounded-md border-rose-200 px-3 text-sm font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700"
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
                <AlertDialogContent size="sm" className="overflow-hidden rounded-lg border border-slate-200 bg-white p-0 shadow-xl">
                    <AlertDialogHeader className="gap-3 px-6 pt-6">
                        <AlertDialogTitle className="text-base font-bold text-slate-950">
                            {action?.title}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm leading-6 text-slate-500">
                            {action?.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-6 border-t border-slate-100 bg-slate-50 px-6 py-4">
                        <AlertDialogCancel className="h-9 rounded-md border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 hover:bg-slate-100">
                            취소
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmAction}
                            className={action?.tone === "rose"
                                ? "h-9 rounded-md border-rose-600 bg-rose-600 px-4 text-sm font-bold text-white hover:bg-rose-700 hover:text-white"
                                : "h-9 rounded-md border-indigo-600 bg-indigo-600 px-4 text-sm font-bold text-white hover:bg-indigo-700 hover:text-white"}
                        >
                            {action?.label}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </aside>
    );
}
