"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { decreaseReportCountAction, increaseReportCountAction } from "@/features/user/action";
import AdminActionConfirmDialog from "./AdminActionConfirmDialog";

interface AdminUserReportCountProps {
    userId: number;
    initialCount: number;
    compact?: boolean;
}

export default function AdminUserReportCount({
    userId,
    initialCount,
    compact = false,
}: AdminUserReportCountProps) {
    const [count, setCount] = useState(initialCount);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pendingDelta, setPendingDelta] = useState<-1 | 1 | null>(null);
    const nextCount = Math.max(0, count + (pendingDelta ?? 0));

    const updateCount = async () => {
        if (pendingDelta === null) return;

        setIsSubmitting(true);

        try {
            // 모달에서 확정한 증감 방향에 맞춰 서버 액션을 호출한다.
            const result = pendingDelta === 1
                ? await increaseReportCountAction(String(userId))
                : await decreaseReportCountAction(String(userId));

            if (!result.success) {
                toast.error(result.message ?? "제재 누적 횟수 변경에 실패했습니다.");
                return;
            }

            setCount(nextCount);
            toast.success(result.message ?? "제재 누적 횟수를 변경했습니다.");
            setPendingDelta(null);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "제재 누적 횟수 변경에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`flex items-center ${compact ? "justify-start" : "justify-between"} gap-1.5`}>
            <span className="whitespace-nowrap text-sm font-bold text-slate-700">{count}회</span>
            <div className="flex items-center gap-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="제재 누적 횟수 감소"
                    onClick={() => setPendingDelta(-1)}
                    disabled={isSubmitting || count === 0}
                    className="size-6 rounded-md p-0 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:text-slate-300"
                >
                    <Minus className="size-3.5" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="제재 누적 횟수 증가"
                    onClick={() => setPendingDelta(1)}
                    disabled={isSubmitting}
                    className="size-6 rounded-md p-0 text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:text-slate-300"
                >
                    <Plus className="size-3.5" />
                </Button>
            </div>
            <AdminActionConfirmDialog
                open={pendingDelta !== null}
                onOpenChange={(open) => !open && setPendingDelta(null)}
                title={pendingDelta === 1 ? "제재 누적 횟수를 올릴까요?" : "제재 누적 횟수를 내릴까요?"}
                description={`제재 누적 횟수가 ${count}회에서 ${nextCount}회로 변경됩니다.`}
                confirmLabel={pendingDelta === 1 ? "횟수 올리기" : "횟수 내리기"}
                tone={pendingDelta === 1 ? "rose" : "indigo"}
                onConfirm={updateCount}
            />
        </div>
    );
}
