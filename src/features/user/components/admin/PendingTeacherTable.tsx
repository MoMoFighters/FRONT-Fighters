"use client";

import Link from "next/link";
import { Check, FileText, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { approvePendingTeacherAction, rejectPendingTeacherAction } from "@/features/user/action";
import { PendingTeacherList } from "@/features/user/type";
import AdminActionConfirmDialog from "./AdminActionConfirmDialog";

interface PendingTeacherTableProps {
    users: PendingTeacherList[];
}

export default function PendingTeacherTable({ users }: PendingTeacherTableProps) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [pendingAction, setPendingAction] = useState<
        | { type: "bulk"; userIds: number[] }
        | { type: "single"; userId: number; action: "APPROVE" | "REJECT" }
        | null
    >(null);

    const toggleUser = (userId: number) => {
        setSelectedIds((current) => current.includes(userId)
            ? current.filter((id) => id !== userId)
            : [...current, userId]);
    };

    const submitPendingAction = async () => {
        if (!pendingAction) return;
        setIsSubmitting(true);

        try {
            const result = pendingAction.type === "bulk"
                ? await approvePendingTeacherAction(pendingAction.userIds.map(String))
                : pendingAction.action === "APPROVE"
                    ? await approvePendingTeacherAction([String(pendingAction.userId)])
                    : await rejectPendingTeacherAction(
                        String(pendingAction.userId),
                        rejectReason,
                    );

            if (!result.success) {
                toast.error(result.message ?? "처리에 실패했습니다.");
                return;
            }

            toast.success(result.message ?? "처리되었습니다.");
            setSelectedIds([]);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "처리에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
            setPendingAction(null);
            setRejectReason("");
        }
    };

    const allSelected = users.length > 0 && selectedIds.length === users.length;

    return (
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
                <p className="text-sm font-bold text-slate-700">
                    승인 대기 강사 <span className="text-indigo-600">{users.length}</span>명
                </p>
                <Button
                    type="button"
                    onClick={() => setPendingAction({ type: "bulk", userIds: selectedIds })}
                    disabled={isSubmitting || selectedIds.length === 0}
                    className="h-9 rounded-md bg-indigo-600 px-3 text-xs font-bold text-white hover:bg-indigo-700"
                >
                    <Check className="size-4" />
                    선택 일괄 승인
                </Button>
            </div>

            <div className="hidden items-center border-b border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-500 md:grid md:min-w-[820px] md:grid-cols-[48px_1fr_1.6fr_.9fr_220px]">
                <input
                    type="checkbox"
                    aria-label="전체 선택"
                    checked={allSelected}
                    onChange={() => setSelectedIds(allSelected ? [] : users.map((user) => user.userId))}
                    className="size-4 rounded border-slate-300 accent-indigo-600"
                />
                <span>이름</span>
                <span>이메일</span>
                <span>가입일</span>
                <span aria-hidden="true" />
            </div>

            {users.length === 0 ? (
                <div className="flex h-64 items-center justify-center text-sm font-bold text-slate-400">
                    승인 대기 중인 강사가 없습니다.
                </div>
            ) : (
                <div className="divide-y divide-slate-100">
                    {users.map((user) => (
                        <div key={user.userId} className="grid grid-cols-1 gap-2 px-5 py-4 text-sm text-slate-600 hover:bg-slate-50 md:grid-cols-[48px_1fr_1.6fr_.9fr_220px] md:items-center md:gap-0 md:min-w-[820px]">
                            <input
                                type="checkbox"
                                aria-label={`${user.name} 선택`}
                                checked={selectedIds.includes(user.userId)}
                                onChange={() => toggleUser(user.userId)}
                                className="size-4 rounded border-slate-300 accent-indigo-600"
                            />
                            <Link href={`/admin/users/${user.userId}?source=pending-teacher`} className="w-fit font-bold text-slate-900 hover:text-indigo-600">
                                {user.name}
                            </Link>
                            <span className="truncate pr-4">{user.email ?? "이메일 정보 없음"}</span>
                            <span>{user.createdAt?.replace("T", " ").slice(0, 10) ?? "-"}</span>
                            <div className="flex justify-start gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setPendingAction({ type: "single", userId: user.userId, action: "REJECT" })}
                                    disabled={isSubmitting}
                                    className="h-8 rounded-md border-slate-200 px-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100"
                                >
                                    <X className="size-3.5" />
                                    거절
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => setPendingAction({ type: "single", userId: user.userId, action: "APPROVE" })}
                                    disabled={isSubmitting}
                                    className="h-8 rounded-md bg-indigo-600 px-2.5 text-xs font-bold text-white hover:bg-indigo-700"
                                >
                                    승인
                                </Button>
                                <Link href={`/admin/users/${user.userId}?source=pending-teacher`} aria-label={`${user.name} 증빙 서류 보기`} className="inline-flex size-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100">
                                    <FileText className="size-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <AdminActionConfirmDialog
                open={pendingAction !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setPendingAction(null);
                        setRejectReason("");
                    }
                }}
                title={pendingAction?.type === "single" && pendingAction.action === "REJECT"
                    ? "강사 승인을 거절할까요?"
                    : "강사 승인을 진행할까요?"}
                description={pendingAction?.type === "bulk"
                    ? `선택한 ${pendingAction.userIds.length}명의 강사를 승인합니다.`
                    : pendingAction?.type === "single" && pendingAction.action === "REJECT"
                        ? "승인 요청을 거절합니다. 거절 사유를 작성해주세요."
                        : "선택한 강사의 활동을 승인합니다."}
                confirmLabel={pendingAction?.type === "single" && pendingAction.action === "REJECT" ? "거절하기" : "승인하기"}
                tone={pendingAction?.type === "single" && pendingAction.action === "REJECT" ? "rose" : "indigo"}
                confirmDisabled={pendingAction?.type === "single" && pendingAction.action === "REJECT" && !rejectReason.trim()}
                onConfirm={submitPendingAction}
            >
                {pendingAction?.type === "single" && pendingAction.action === "REJECT" && (
                    <textarea
                        value={rejectReason}
                        onChange={(event) => setRejectReason(event.target.value)}
                        placeholder="강사에게 전달할 거절 사유를 작성해주세요."
                        className="min-h-24 w-full resize-none rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-3 focus:ring-indigo-50"
                    />
                )}
            </AdminActionConfirmDialog>
        </section>
    );
}
