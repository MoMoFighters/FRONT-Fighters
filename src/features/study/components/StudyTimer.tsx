"use client";

import { Pause, Play, Square } from "lucide-react";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { formatStudyTime } from "@/features/study/utils";

interface StudyTimerProps {
    title: string;
    seconds: number;
    isRunning: boolean;
    isEnded?: boolean;
    endLabel?: string;
    canStart?: boolean;
    startDisabledMessage?: string;
    onTogglePause: () => void;
    onEnd: () => void;
}

export default function StudyTimer({
    title,
    seconds,
    isRunning,
    isEnded = false,
    endLabel = "종료",
    canStart = true,
    startDisabledMessage = "이미 다른 곳에서 진행 중인 타이머가 있습니다.",
    onTogglePause,
    onEnd,
}: StudyTimerProps) {
    const statusLabel = isEnded
        ? "종료됨"
        : isRunning
            ? "공부 중"
            : "일시정지";

    // 시작(재생) 버튼만 이 조건으로 막는다 - 이미 실행 중인 걸 멈추는 동작(일시정지)은 항상 허용
    const isStartBlocked = !isEnded && !isRunning && !canStart;

    // 1시간(3600초)을 한 바퀴(360도) 기준으로 삼아 링이 차오르는 방식
    const RING_RADIUS = 46;
    const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
    const progressRatio = (seconds % 3600) / 3600;
    const ringDashOffset = RING_CIRCUMFERENCE * (1 - progressRatio);

    const playButton = (
        <button
            type="button"
            onClick={() => {
                if (isEnded || isStartBlocked) {
                    return;
                }

                onTogglePause();
            }}
            aria-disabled={isEnded || isStartBlocked}
            aria-label={isRunning ? "일시정지" : "시작"}
            className={`flex h-12 w-12 items-center justify-center rounded-full text-white shadow-md transition ${isEnded || isStartBlocked
                ? "cursor-not-allowed bg-slate-300 shadow-none"
                : "cursor-pointer bg-indigo-500 shadow-indigo-200 hover:bg-indigo-600"
                }`}
        >
            {isRunning ? (
                <Pause className="h-5 w-5" fill="currentColor" />
            ) : (
                <Play className="ml-0.5 h-5 w-5" fill="currentColor" />
            )}
        </button>
    );

    return (
        <div className="flex flex-col items-center rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
            <h2 className="mb-8 whitespace-pre-line text-center text-2xl font-black tracking-tight text-slate-900">
                {title}
            </h2>

            <div
                className={`relative flex h-64 w-64 flex-col items-center justify-center rounded-full transition-all duration-300 ${isEnded
                    ? "bg-slate-100 shadow-lg"
                    : "bg-gradient-to-br from-indigo-50 via-white to-sky-50 shadow-[0_20px_60px_rgba(79,70,229,0.15)]"
                    }`}
            >
                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
                    <circle
                        cx="50"
                        cy="50"
                        r={RING_RADIUS}
                        fill="none"
                        strokeWidth="7"
                        className={isRunning ? "stroke-indigo-100" : "stroke-slate-200"}
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r={RING_RADIUS}
                        fill="none"
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeDasharray={RING_CIRCUMFERENCE}
                        strokeDashoffset={ringDashOffset}
                        className={`transition-[stroke-dashoffset,stroke] duration-500 ease-linear ${isRunning ? "stroke-indigo-500" : "stroke-slate-400"
                            }`}
                    />
                </svg>

                <div className="absolute inset-4 rounded-full border border-white/70 bg-white shadow-inner" />

                <div className="relative z-10 flex flex-col items-center">
                    <p className="font-mono text-5xl font-black tracking-tight text-slate-900">
                        {formatStudyTime(seconds)}
                    </p>

                    <span
                        className={`mt-5 rounded-full px-4 py-1.5 text-xs font-bold ${isEnded
                            ? "bg-slate-200 text-slate-500"
                            : isRunning
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                    >
                        {statusLabel}
                    </span>
                </div>
            </div>

            <div className="mt-8 flex items-center gap-5">
                {isStartBlocked ? (
                    <HoverCard openDelay={100}>
                        <HoverCardTrigger asChild>
                            {playButton}
                        </HoverCardTrigger>
                        <HoverCardContent className="text-center text-xs font-bold text-slate-600">
                            {startDisabledMessage}
                        </HoverCardContent>
                    </HoverCard>
                ) : (
                    playButton
                )}

                <button
                    type="button"
                    onClick={onEnd}
                    disabled={isEnded}
                    className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                    aria-label={endLabel}
                >
                    <Square className="h-5 w-5" fill="currentColor" />
                </button>
            </div>
        </div>
    );
}
