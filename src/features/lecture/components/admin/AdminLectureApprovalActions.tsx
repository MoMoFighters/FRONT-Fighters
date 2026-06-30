"use client";

import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { updateLectureStatusAction } from "@/features/lecture/action";

interface AdminLectureApprovalActionsProps {
    lectureIds: number[];
    bulk?: boolean;
}

type ApprovalAction = "APPROVE" | "REJECT";

export default function AdminLectureApprovalActions({
    lectureIds,
    bulk = false,
}: AdminLectureApprovalActionsProps) {
    const router = useRouter();
    const [pendingAction, setPendingAction] = useState<ApprovalAction | null>(null);
    const [dialogAction, setDialogAction] = useState<ApprovalAction | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const lectureCount = lectureIds.length;

    const submit = async () => {
        if (!pendingAction || lectureCount === 0) return;

        setIsSubmitting(true);

        try {
            // TODO: 강의 상태 변경 API가 미승인 사유를 받도록 확장되면 rejectionReason도 함께 전달한다.
            await Promise.all(
                lectureIds.map((lectureId) => updateLectureStatusAction(
                    String(lectureId),
                    pendingAction === "APPROVE" ? "ACTIVE" : "HOLD",
                )),
            );
            toast.success(
                pendingAction === "APPROVE"
                    ? `${lectureCount}개 강의를 승인했습니다.`
                    : "강의를 미승인 처리했습니다.",
            );
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "강의 상태 변경에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
            setPendingAction(null);
        }
    };

    const openDialog = (action: ApprovalAction) => {
        if (action === "REJECT") {
            setRejectionReason("");
        }

        setDialogAction(action);
        setPendingAction(action);
    };

    const isApprove = dialogAction === "APPROVE";
    const title = isApprove
        ? bulk ? "선택한 강의를 일괄 승인할까요?" : "강의를 승인할까요?"
        : "강의를 미승인 처리할까요?";
    const description = isApprove
        ? `${lectureCount}개 강의가 공개 가능한 상태로 변경됩니다.`
        : "작성한 사유와 함께 강의가 미승인 상태로 변경되며 공개되지 않습니다.";

    return (
        <>
            {bulk ? (
                <Button
                    type="button"
                    disabled={lectureCount === 0}
                    onClick={() => openDialog("APPROVE")}
                    className="h-9 rounded-md bg-indigo-500 px-3 text-sm font-bold text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-200"
                >
                    <Check className="size-4" />
                    선택 일괄 승인
                </Button>
            ) : (
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => openDialog("REJECT")}
                        className="h-8 rounded-md border-slate-200 px-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                    >
                        <X className="size-3.5" />
                        미승인
                    </Button>
                    <Button
                        type="button"
                        onClick={() => openDialog("APPROVE")}
                        className="h-8 rounded-md bg-indigo-500 px-2 text-xs font-bold text-white hover:bg-indigo-600"
                    >
                        승인
                    </Button>
                </div>
            )}

            <AlertDialog
                open={pendingAction !== null}
                onOpenChange={(open) => !open && setPendingAction(null)}
            >
                <AlertDialogContent size="sm" className="overflow-hidden rounded-lg border border-slate-200 bg-white p-0 shadow-xl">
                    <AlertDialogHeader className="gap-3 px-6 pt-6">
                        <AlertDialogTitle className="text-base font-bold text-slate-950">{title}</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm leading-6 text-slate-500">{description}</AlertDialogDescription>
                        {!isApprove && (
                            <div className="mt-2 w-full text-left">
                                <label htmlFor="lecture-rejection-reason" className="text-sm font-bold text-slate-700">
                                    미승인 사유
                                </label>
                                <textarea
                                    id="lecture-rejection-reason"
                                    value={rejectionReason}
                                    onChange={(event) => setRejectionReason(event.target.value)}
                                    placeholder="강사에게 전달할 미승인 사유를 입력하세요."
                                    className="mt-2 min-h-24 w-full resize-y rounded-md border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-800 outline-none placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-3 focus:ring-indigo-50"
                                />
                            </div>
                        )}
                    </AlertDialogHeader>
                    <AlertDialogFooter className="!mx-0 !mb-0 mt-6 !flex !flex-row !justify-end gap-2 !border-0 !bg-transparent !px-6 !pb-6 !pt-0">
                        <AlertDialogCancel className="h-9 rounded-md border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 hover:bg-slate-100">취소</AlertDialogCancel>
                        <AlertDialogAction
                            variant="outline"
                            disabled={isSubmitting || (!isApprove && !rejectionReason.trim())}
                            onClick={submit}
                            className={isApprove
                                ? "h-9 rounded-md !border-indigo-600 !bg-indigo-600 px-4 text-sm font-bold !text-white hover:!bg-indigo-700 hover:!text-white"
                                : "h-9 rounded-md !border-rose-600 !bg-rose-600 px-4 text-sm font-bold !text-white hover:!bg-rose-700 hover:!text-white"}
                        >
                            {isApprove ? "승인" : "미승인 처리"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
