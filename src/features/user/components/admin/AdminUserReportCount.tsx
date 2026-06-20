"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import AdminActionConfirmDialog from "./AdminActionConfirmDialog";

interface AdminUserReportCountProps {
    initialCount: number;
    compact?: boolean;
}

export default function AdminUserReportCount({
    initialCount,
    compact = false,
}: AdminUserReportCountProps) {
    // TODO: 신고 점수 증감 API 명세가 확정되면 이 로컬 상태를 API 응답값으로 교체한다.
    const [count, setCount] = useState(initialCount);
    const [pendingDelta, setPendingDelta] = useState<-1 | 1 | null>(null);
    const nextCount = Math.max(0, count + (pendingDelta ?? 0));

    return (
        <div className={`flex items-center ${compact ? "justify-start" : "justify-between"} gap-1.5`}>
            <span className="whitespace-nowrap text-sm font-bold text-slate-700">{count}회</span>
            <div className="flex items-center gap-1">
                <Button type="button" variant="ghost" size="icon" aria-label="신고 횟수 감소" onClick={() => setPendingDelta(-1)} className="size-6 rounded-md p-0 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                    <Minus className="size-3.5" />
                </Button>
                <Button type="button" variant="ghost" size="icon" aria-label="신고 횟수 증가" onClick={() => setPendingDelta(1)} className="size-6 rounded-md p-0 text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700">
                    <Plus className="size-3.5" />
                </Button>
            </div>
            <AdminActionConfirmDialog
                open={pendingDelta !== null}
                onOpenChange={(open) => !open && setPendingDelta(null)}
                title={pendingDelta === 1 ? "신고 횟수를 올릴까요?" : "신고 횟수를 내릴까요?"}
                description={`신고 횟수가 ${count}회에서 ${nextCount}회로 변경됩니다.`}
                confirmLabel={pendingDelta === 1 ? "횟수 올리기" : "횟수 내리기"}
                tone={pendingDelta === 1 ? "rose" : "indigo"}
                onConfirm={() => {
                    setCount(nextCount);
                    setPendingDelta(null);
                }}
            />
        </div>
    );
}
