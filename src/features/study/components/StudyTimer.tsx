"use client";

import { Pause, Play, Square } from "lucide-react";

import { formatStudyTime } from "@/features/study/utils";

interface StudyTimerProps {
    title: string;
    seconds: number;
    isRunning: boolean;
    isEnded?: boolean;
    endLabel?: string;
    onTogglePause: () => void;
    onEnd: () => void;
}

export default function StudyTimer({
    title,
    seconds,
    isRunning,
    isEnded = false,
    endLabel = "종료",
    onTogglePause,
    onEnd,
}: StudyTimerProps) {
    const statusLabel = isEnded
        ? "종료됨"
        : isRunning
            ? "공부 중"
            : "일시정지";

    return (
        <div className="flex shrink-0 flex-col items-center">
            <h2 className="mb-6 whitespace-pre-line text-center text-xl font-black leading-tight text-slate-900">
                {title}
            </h2>

            <div
                className={`flex h-72 w-72 flex-col items-center justify-center rounded-full border-4 ${
                    isEnded ? "border-slate-300" : "border-slate-800"
                }`}
            >
                <p className="font-mono text-4xl font-black text-slate-900">
                    {formatStudyTime(seconds)}
                </p>
                <p className="mt-2 text-xs font-bold text-slate-400">
                    {statusLabel}
                </p>
            </div>

            <div className="mt-6 flex items-center gap-3">
                <button
                    type="button"
                    onClick={onTogglePause}
                    disabled={isEnded}
                    className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-indigo-500 text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                    aria-label={isRunning ? "일시정지" : "시작"}
                >
                    {isRunning ? (
                        <Pause className="h-5 w-5" fill="currentColor" />
                    ) : (
                        <Play className="ml-0.5 h-5 w-5" fill="currentColor" />
                    )}
                </button>

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
