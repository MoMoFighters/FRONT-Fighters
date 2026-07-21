"use client";

import { useEffect, useState } from "react";
import { History } from "lucide-react";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import StudyUserItem from "@/components/study/StudyUserItem";
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
    StudyRoomSeatUser,
    StudyTimerLap,
} from "@/features/study/type";

interface SoloStudyViewProps {
    myNickname: string | null;
    initialSession: SoloCurrentSessionResult | null;
    dailyTotalSeconds: number;
    monthlyTotalSeconds: number;
}

export default function SoloStudyView({
    myNickname,
    initialSession,
    dailyTotalSeconds,
    monthlyTotalSeconds,
}: SoloStudyViewProps) {
    const [seconds, setSeconds] = useState(initialSession?.accumulatedSeconds ?? 0);
    const [isRunning, setIsRunning] = useState(initialSession?.status === "RUNNING");
    const [laps, setLaps] = useState<StudyTimerLap[]>([]);
    const [isLapsLoading, setIsLapsLoading] = useState(false);
    const [isLapModalOpen, setIsLapModalOpen] = useState(false);
    const [canStartTimer, setCanStartTimer] = useState(true);

    const meSeat: StudyRoomSeatUser = {
        userId: 0,
        nickname: myNickname ?? "나",
        status: "JOINED",
        timerStatus: isRunning ? "STUDYING" : "RESTING",
        totalSeconds: seconds,
        isHost: false,
        isMe: true,
    };

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
                toast.error(response.message || "랩 목록을 불러오지 못했습니다.");
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
                <section className="flex w-full flex-col lg:max-w-100">
                    <div className="relative rounded-2xl border border-slate-300 bg-white py-4 text-center shadow-sm">
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

                        <button
                            type="button"
                            disabled={isLapsLoading}
                            onClick={() => void handleRefreshLapsClick()}
                            className="absolute right-2 top-1/2 flex -translate-y-1/2 cursor-pointer items-center gap-1 rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-black text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-500 disabled:cursor-wait disabled:opacity-60 sm:right-4 sm:px-2.5"
                        >
                            <History className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">
                                {isLapsLoading ? "불러오는 중..." : "내 랩 목록 조회"}
                            </span>
                        </button>
                    </div>

                    <div className="mx-auto mt-10 w-40">
                        <StudyUserItem roomId={0} user={meSeat} showLapButton={false} />
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

                    <div className="mt-8">
                        <StudyWebcamPreview />
                    </div>
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
                            <p className="py-6 text-center text-xs font-bold text-slate-400">
                                불러오는 중...
                            </p>
                        ) : laps.length === 0 ? (
                            <p className="py-6 text-center text-xs font-bold text-slate-400">
                                시작하고 종료하면 랩이 기록됩니다.
                            </p>
                        ) : (
                            [...laps].reverse().map((lap) => (
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
