"use client";

import { Check, Download, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { updateTeacherStatusAction } from "@/features/user/action";
import AdminActionConfirmDialog from "./AdminActionConfirmDialog";

interface PendingTeacherReviewPanelProps {
    userId: number;
    proofUrl?: string;
}

export default function PendingTeacherReviewPanel({ userId, proofUrl }: PendingTeacherReviewPanelProps) {
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pendingAction, setPendingAction] = useState<"APPROVE" | "REJECT" | null>(null);

    const requestReview = (action: "APPROVE" | "REJECT") => {
        if (action === "REJECT" && !reason.trim()) {
            toast.error("거절 사유를 입력해주세요.");
            return;
        }
        setPendingAction(action);
    };

    const review = async () => {
        if (!pendingAction) return;
        const action = pendingAction;
        setIsSubmitting(true);

        try {
            await updateTeacherStatusAction(String(userId), action, reason.trim() || undefined);
            toast.success(action === "APPROVE" ? "강사를 승인했습니다." : "강사 승인을 거절했습니다.");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "승인 처리에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
            setPendingAction(null);
        }
    };

    return (
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
                <div><h2 className="text-base font-bold text-slate-950">승인 처리</h2><p className="mt-1 text-sm font-medium text-slate-500">증빙 서류를 확인한 뒤 승인 또는 거절을 진행합니다.</p></div>
                {proofUrl && <a href={proofUrl} download className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-xs font-bold text-slate-700 hover:bg-slate-50"><Download className="size-4" />서류 다운로드</a>}
            </div>
            <label className="mt-5 block text-sm font-bold text-slate-700" htmlFor="reject-reason">거절 사유</label>
            <textarea id="reject-reason" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="승인 거절 시 강사에게 전달할 사유를 작성합니다." className="mt-2 min-h-24 w-full resize-y rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-3 focus:ring-indigo-50" />
            <div className="mt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => requestReview("REJECT")} disabled={isSubmitting || !reason.trim()} className="h-10 rounded-md border-slate-200 px-4 text-sm font-bold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"><X className="size-4" />거절</Button>
                <Button type="button" onClick={() => requestReview("APPROVE")} disabled={isSubmitting} className="h-10 rounded-md bg-indigo-600 px-4 text-sm font-bold text-white hover:bg-indigo-700"><Check className="size-4" />승인</Button>
            </div>
            <AdminActionConfirmDialog open={pendingAction !== null} onOpenChange={(open) => !open && setPendingAction(null)} title={pendingAction === "REJECT" ? "강사 승인을 거절할까요?" : "강사 승인을 진행할까요?"} description={pendingAction === "REJECT" ? `다음 사유로 거절합니다.\n${reason}` : "증빙 서류를 확인하고 강사 활동을 승인합니다."} confirmLabel={pendingAction === "REJECT" ? "거절하기" : "승인하기"} tone={pendingAction === "REJECT" ? "rose" : "indigo"} onConfirm={review} />
        </section>
    );
}
