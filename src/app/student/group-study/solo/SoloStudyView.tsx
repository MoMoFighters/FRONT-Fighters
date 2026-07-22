"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import StudyStreakBadge from "@/components/study/StudyStreakBadge";
import StudyQuoteCard from "@/components/study/StudyQuoteCard";
import StudyWeeklyChart from "@/components/study/StudyWeeklyChart";
import StudyWebcamPreview from "@/components/study/StudyWebcamPreview";
import StudyTimer from "@/features/study/components/StudyTimer";
import {
    getSoloStudyLabList,
    getTimerAvailability,
    pauseSoloStudyTimer,
    startSoloStudyTimer,
    stopSoloStudyTimer,
} from "@/features/study/actions";
import { formatStudyTime } from "@/features/study/utils";
import type {
    SoloCurrentSessionResult,
    StudyTimerLap,
} from "@/features/study/type";

interface WeeklyRecord {
    date: string;
    totalSeconds: number;
}

interface SoloStudyViewProps {
    initialSession: SoloCurrentSessionResult | null;
    dailyTotalSeconds: number;
    monthlyTotalSeconds: number;
    streakDays: number;
    weeklyRecords: WeeklyRecord[];
}

export default function SoloStudyView({
    initialSession,
    dailyTotalSeconds,
    monthlyTotalSeconds,
    streakDays,
    weeklyRecords,
}: SoloStudyViewProps) {
    const [seconds, setSeconds] = useState(initialSession?.accumulatedSeconds ?? 0);
    const [isRunning, setIsRunning] = useState(initialSession?.status === "RUNNING");
    const [laps, setLaps] = useState<StudyTimerLap[]>([]);
    const [isLapsLoading, setIsLapsLoading] = useState(false);
    const [isLapModalOpen, setIsLapModalOpen] = useState(false);
    const [canStartTimer, setCanStartTimer] = useState(true);

    const refreshTimerAvailability = async () => {
        const response = await getTimerAvailability();

        if (response.status === 200 && response.data) {
            setCanStartTimer(response.data.canStartTimer);
        }
    };

    useEffect(() => {
        if (!initialSession) {
            return;
        }

        void refreshLaps();
        // 최초 진입 시 이미 진행 중인 세션이 있으면 랩 기록을 한 번만 불러온다.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void refreshTimerAvailability();
    }, []);

    useEffect(() => {
        if (!isRunning) {
            return;
        }

        const intervalId = window.setInterval(() => {
            setSeconds((prev) => prev + 1);
        }, 1000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [isRunning]);

    const refreshLaps = async () => {
        const response = await getSoloStudyLabList();

        if (response.status >= 400) {
            return;
        }

        setLaps(response.data.laps);
    };

    const handleRefreshLapsClick = async () => {
        setIsLapModalOpen(true);
        setIsLapsLoading(true);

        try {
            const response = await getSoloStudyLabList();

            if (response.status >= 400) {
                if (response.status !== 404) {
                    toast.error(response.message || "랩 목록을 불러오지 못했습니다.");
                }
                setLaps([]);
                return;
            }

            setLaps(response.data.laps);
        } finally {
            setIsLapsLoading(false);
        }
    };

    const handleTogglePause = async () => {
        if (isRunning) {
            const response = await pauseSoloStudyTimer();

            if (response.status >= 400) {
                toast.error(response.message || "솔로 타이머 일시정지에 실패했습니다.");
                return;
            }

            setSeconds(response.data.accumulatedSeconds);
            setIsRunning(false);
            void refreshLaps();
            void refreshTimerAvailability();
            return;
        }

        const response = await startSoloStudyTimer();

        if (response.status >= 400) {
            toast.error(response.message || "솔로 타이머 시작에 실패했습니다.");
            return;
        }

        setSeconds(response.data.accumulatedSeconds);
        setIsRunning(true);
        void refreshLaps();
    };

    const handleEnd = async () => {
        const response = await stopSoloStudyTimer();

        if (response.status >= 400) {
            toast.error(response.message || "솔로 타이머 종료에 실패했습니다.");
            return;
        }

        setSeconds(0);
        setIsRunning(false);
        void refreshLaps();
        void refreshTimerAvailability();
    };

    return (
        <>
            <div className="mx-auto mt-8 flex w-full max-w-360 flex-col items-stretch gap-8 lg:flex-row lg:items-start lg:justify-center">
                <aside className="flex w-full flex-col items-center gap-4 lg:w-64 lg:shrink-0">
                    <StudyStreakBadge streakDays={streakDays} />
                    <StudyWeeklyChart records={weeklyRecords} />
                    <StudyQuoteCard />
                </aside>

                <section className="flex w-full flex-col items-center lg:max-w-100">
                    <div className="w-full rounded-2xl border border-slate-300 bg-white py-4 text-center shadow-sm">
                        <h1 className="text-xl font-black text-slate-900 sm:text-2xl">
                            내 공부시간{" "}
                            <span className="font-mono text-indigo-500">
                                {formatStudyTime(seconds)}
                            </span>
                        </h1>
                        <p className="mt-1 text-xs font-bold text-slate-400">
                            오늘 누적 {formatStudyTime(dailyTotalSeconds)} · 이번 달 누적{" "}
                            {formatStudyTime(monthlyTotalSeconds)}
                        </p>
                    </div>

                    <div className="mt-10 w-full max-w-96">
                        <StudyWebcamPreview
                            isTimerRunning={isRunning}
                            onAbsenceTimeout={() => void handleTogglePause()}
                            onOpenLaps={() => void handleRefreshLapsClick()}
                        />
                    </div>
                </section>

                <div className="flex shrink-0 flex-col items-center">
                    <StudyTimer
                        title={"집중\n타이머"}
                        seconds={seconds}
                        isRunning={isRunning}
                        endLabel="랩 종료"
                        canStart={canStartTimer}
                        onTogglePause={() => void handleTogglePause()}
                        onEnd={() => void handleEnd()}
                    />
                </div>
            </div>

            <Dialog open={isLapModalOpen} onOpenChange={setIsLapModalOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>랩(Lap) 기록</DialogTitle>
                        <DialogDescription>
                            이번 세션에서 기록한 랩 목록입니다.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="h-72 space-y-1 overflow-y-auto scrollbar-none">
                        {isLapsLoading ? (
                            <div className="flex h-full items-center justify-center">
                                <p className="text-center text-xs font-bold text-slate-400">
                                    불러오는 중...
                                </p>
                            </div>
                        ) : laps.length === 0 ? (
                            <div className="flex h-full items-center justify-center">
                                <p className="text-center text-xs font-bold text-slate-400">
                                    시작하고 종료하면 랩이 기록됩니다.
                                </p>
                            </div>
                        ) : (
                            laps.map((lap) => (
                                <div
                                    key={lap.lapNumber}
                                    className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
                                >
                                    <span className="text-xs font-bold text-slate-500">
                                        Lap {lap.lapNumber}
                                    </span>
                                    <span className="font-mono text-sm font-black text-slate-800">
                                        {lap.seconds === null ? "진행 중" : formatStudyTime(lap.seconds)}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
