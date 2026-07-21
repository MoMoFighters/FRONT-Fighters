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
        <div className="flex shrink-0 flex-col items-center">
            <h2 className="mb-6 whitespace-pre-line text-center text-xl font-black leading-tight text-slate-900">
                {title}
            </h2>

            <div
                className={`flex h-56 w-56 flex-col items-center justify-center rounded-full border-4 sm:h-64 sm:w-64 lg:h-72 lg:w-72 ${
                    isEnded ? "border-slate-300" : "border-slate-800"
                }`}
            >
                <p className="font-mono text-3xl font-black text-slate-900 sm:text-4xl">
                    {formatStudyTime(seconds)}
                </p>
                <p className="mt-2 text-xs font-bold text-slate-400">
                    {statusLabel}
                </p>
            </div>

            <div className="mt-6 flex items-center gap-3">
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
                    className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-rose-500 text-white shadow-md shadow-rose-200 transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                    aria-label={endLabel}
                >
                    <Square className="h-4 w-4" fill="currentColor" />
                </button>
            </div>
        </div>
    );
}
