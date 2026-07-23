import { memo } from "react";

interface StudyStreakBadgeProps {
    streakDays: number;
}

function StudyStreakBadge({ streakDays }: StudyStreakBadgeProps) {
    const hasStreak = streakDays > 0;

    return (
        <div className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-xl">
                🔥
            </span>
            <div className="min-w-0">
                <p className="truncate text-sm font-black text-slate-900">
                    {hasStreak ? `${streakDays}일 연속 공부 중` : "오늘부터 스트릭을 시작해보세요"}
                </p>
                <p className="mt-0.5 text-xs font-bold text-slate-400">
                    {hasStreak ? "이 기세를 이어가 보세요!" : "하루라도 공부하면 스트릭이 시작돼요"}
                </p>
            </div>
        </div>
    );
}

export default memo(StudyStreakBadge);
