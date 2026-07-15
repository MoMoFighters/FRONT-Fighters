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
import StudyTimer from "@/features/study/components/StudyTimer";
import {
    getSoloStudyHistory,
    getSoloStudyLabList,
    pauseSoloStudyTimer,
    startSoloStudyTimer,
    stopSoloStudyTimer,
} from "@/features/study/actions";
import { formatStudyTime } from "@/features/study/utils";
import type {
    SoloCurrentSessionResult,
    SoloStudyHistoryItem,
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
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);
    const [history, setHistory] = useState<SoloStudyHistoryItem[]>([]);

    const meSeat: StudyRoomSeatUser = {
        userId: 0,
        nickname: myNickname ?? "나",
        status: "JOINED",
        timerStatus: isRunning ? "STUDYING" : "RESTING",
        isHost: false,
        isMe: true,
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

        if (response.statusCode >= 400) {
            return;
        }

        setLaps(response.data.laps);
    };

    const handleTogglePause = async () => {
        if (isRunning) {
            const response = await pauseSoloStudyTimer();

            if (response.statusCode >= 400) {
                toast.error(response.message || "솔로 타이머 일시정지에 실패했습니다.");
                return;
            }

            setSeconds(response.data.accumulatedSeconds);
            setIsRunning(false);
            void refreshLaps();
            return;
        }

        const response = await startSoloStudyTimer();

        if (response.statusCode >= 400) {
            toast.error(response.message || "솔로 타이머 시작에 실패했습니다.");
            return;
        }

        setSeconds(response.data.accumulatedSeconds);
        setIsRunning(true);
        void refreshLaps();
    };

    const handleEnd = async () => {
        const response = await stopSoloStudyTimer();

        if (response.statusCode >= 400) {
            toast.error(response.message || "솔로 타이머 종료에 실패했습니다.");
            return;
        }

        setSeconds(0);
        setIsRunning(false);
        void refreshLaps();
    };

    const handleOpenHistory = async () => {
        setIsHistoryOpen(true);
        setIsHistoryLoading(true);

        try {
            const response = await getSoloStudyHistory();

            if (response.statusCode >= 400) {
                toast.error(response.message || "세션 이력을 불러오지 못했습니다.");
                setHistory([]);
                return;
            }

            setHistory(response.data);
        } finally {
            setIsHistoryLoading(false);
        }
    };

    return (
        <>
            <div className="mx-auto mt-8 flex w-full max-w-360 items-start justify-center gap-8">
                <section className="flex w-full max-w-100 flex-col">
                    <div className="relative rounded-2xl border border-slate-300 bg-white py-4 text-center shadow-sm">
                        <h1 className="text-2xl font-black text-slate-900">
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
                            onClick={() => void handleOpenHistory()}
                            className="absolute right-4 top-1/2 flex -translate-y-1/2 cursor-pointer items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-black text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-500"
                        >
                            <History className="h-3.5 w-3.5" />
                            세션 기록
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
                        onTogglePause={() => void handleTogglePause()}
                        onEnd={() => void handleEnd()}
                    />

                    <div className="mt-8 w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <p className="text-sm font-black text-slate-900">
                            랩(Lap) 기록
                        </p>

                        <div className="mt-3 max-h-56 space-y-1 overflow-y-auto scrollbar-none">
                            {laps.length === 0 ? (
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
                    </div>
                </div>
            </div>

            <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>솔로 세션 기록</DialogTitle>
                        <DialogDescription>
                            지난 솔로 세션 기록을 확인할 수 있습니다.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-1">
                        {isHistoryLoading ? (
                            <div className="py-6 text-center text-xs font-bold text-slate-400">
                                불러오는 중...
                            </div>
                        ) : history.length === 0 ? (
                            <div className="py-6 text-center text-xs font-bold text-slate-400">
                                지난 세션 기록이 없습니다.
                            </div>
                        ) : (
                            history.map((session) => (
                                <div
                                    key={session.sessionId}
                                    className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
                                >
                                    <span className="text-xs font-bold text-slate-500">
                                        {session.startTime.slice(0, 10)}
                                    </span>
                                    <span className="font-mono text-sm font-black text-slate-800">
                                        {formatStudyTime(session.totalSeconds)}
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
