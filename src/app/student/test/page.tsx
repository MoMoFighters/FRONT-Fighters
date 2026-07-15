"use client";

import { useEffect, useState } from "react";
import { Crown, NotebookPen, Pause, Play, Timer as TimerIcon } from "lucide-react";

interface StudySeat {
    seatNumber: number;
    name: string;
    isHost: boolean;
    isMe: boolean;
    label: string;
    labelType: "name" | "timer";
}

const STUDY_SEATS: StudySeat[] = [
    {
        seatNumber: 1,
        name: "상희",
        isHost: true,
        isMe: false,
        label: "상희",
        labelType: "name",
    },
    {
        seatNumber: 2,
        name: "민수",
        isHost: false,
        isMe: true,
        label: "나",
        labelType: "name",
    },
    {
        seatNumber: 3,
        name: "지영",
        isHost: false,
        isMe: false,
        label: "2:20:01",
        labelType: "timer",
    },
    {
        seatNumber: 4,
        name: "현우",
        isHost: false,
        isMe: false,
        label: "1:17:42",
        labelType: "timer",
    },
];

const TODAY_RANKING = [
    { rank: 1, name: "지영", time: "3:12:40" },
    { rank: 2, name: "현우", time: "2:05:11" },
    { rank: 3, name: "상희", time: "1:40:02" },
];

const formatElapsed = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
        .map((value) => String(value).padStart(2, "0"))
        .join(":");
};

export default function StudyTimerTestPage() {
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        if (!isRunning) {
            return;
        }

        const intervalId = window.setInterval(() => {
            setElapsedSeconds((prev) => prev + 1);
        }, 1000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [isRunning]);

    return (
        <main className="min-h-[calc(100vh-137px)] bg-white px-8 py-8">
            <div className="mx-auto flex w-full max-w-360 items-start justify-center gap-8">
                {/* 오늘의 랭킹 */}
                <aside className="w-56 shrink-0 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-black text-slate-900">
                        오늘의 랭킹
                    </h2>

                    <ul className="mt-6 space-y-4">
                        {TODAY_RANKING.map((item, index) => (
                            <li
                                key={item.rank}
                                className="flex items-center gap-3"
                                style={{ marginLeft: `${index * 20}px` }}
                            >
                                <span
                                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                                        item.rank === 1
                                            ? "bg-amber-100 text-amber-600"
                                            : item.rank === 2
                                                ? "bg-slate-200 text-slate-600"
                                                : "bg-orange-100 text-orange-500"
                                    }`}
                                >
                                    {item.rank}
                                </span>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-bold text-slate-800">
                                        {item.name}
                                    </p>
                                    <p className="text-[11px] font-semibold text-slate-400">
                                        {item.time}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* 내 공부시간 */}
                <section className="flex w-full max-w-125 flex-col">
                    <div className="rounded-2xl border border-slate-300 bg-white py-4 text-center shadow-sm">
                        <h1 className="text-2xl font-black text-slate-900">
                            내 공부시간
                        </h1>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-x-10 gap-y-12">
                        {STUDY_SEATS.map((seat) => (
                            <div key={seat.seatNumber} className="relative pt-7">
                                {seat.isHost && (
                                    <Crown
                                        className="absolute left-1/2 top-0 z-10 h-6 w-6 -translate-x-1/2 text-amber-400"
                                        fill="currentColor"
                                    />
                                )}

                                <div className="absolute left-1/2 top-2 z-0 h-14 w-14 -translate-x-1/2 overflow-hidden rounded-full border-2 border-white bg-slate-100 shadow-sm">
                                    <div className="flex h-full w-full items-center justify-center text-sm font-black text-slate-400">
                                        {seat.name.slice(0, 1)}
                                    </div>
                                </div>

                                <div
                                    className={`flex h-28 flex-col items-center justify-end rounded-2xl border-2 bg-white pb-3 shadow-sm ${
                                        seat.isMe
                                            ? "border-orange-400"
                                            : "border-slate-200"
                                    }`}
                                >
                                    {seat.labelType === "timer" ? (
                                        <TimerIcon className="h-6 w-6 text-slate-300" />
                                    ) : (
                                        <NotebookPen className="h-6 w-6 text-slate-300" />
                                    )}
                                </div>

                                <div
                                    className={`mt-2 rounded-lg border py-1.5 text-center text-sm font-bold ${
                                        seat.isMe
                                            ? "border-orange-200 bg-orange-50 text-orange-600"
                                            : "border-slate-200 bg-slate-50 text-slate-600"
                                    }`}
                                >
                                    {seat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 집중 타이머 */}
                <div className="flex shrink-0 flex-col items-center">
                    <h2 className="mb-6 text-center text-xl font-black leading-tight text-slate-900">
                        집중
                        <br />
                        타이머
                    </h2>

                    <div className="flex h-72 w-72 flex-col items-center justify-center rounded-full border-4 border-slate-800">
                        <p className="font-mono text-4xl font-black text-slate-900">
                            {formatElapsed(elapsedSeconds)}
                        </p>
                        <p className="mt-2 text-xs font-bold text-slate-400">
                            {isRunning ? "공부 중" : "일시정지"}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsRunning((prev) => !prev)}
                        className="mt-6 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-indigo-500 text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-600"
                        aria-label={isRunning ? "일시정지" : "시작"}
                    >
                        {isRunning ? (
                            <Pause className="h-5 w-5" fill="currentColor" />
                        ) : (
                            <Play className="ml-0.5 h-5 w-5" fill="currentColor" />
                        )}
                    </button>
                </div>
            </div>
        </main>
    );
}
