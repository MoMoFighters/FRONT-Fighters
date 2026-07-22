"use client";

import { useState } from "react";

import type { StudyRankingEntry } from "@/features/study/type";
import StudyRankUserItem from "./StudyRankUserItem";

type RankTab = "DAILY" | "MONTHLY";

interface StudyRankProps {
    dailyRanking: StudyRankingEntry[];
    monthlyRanking: StudyRankingEntry[];
}

export default function StudyRank({ dailyRanking, monthlyRanking }: StudyRankProps) {
    const [tab, setTab] = useState<RankTab>("DAILY");

    const ranking = tab === "DAILY" ? dailyRanking : monthlyRanking;
    const [second, first, third] = [
        ranking.find((entry) => entry.rank === 2),
        ranking.find((entry) => entry.rank === 1),
        ranking.find((entry) => entry.rank === 3),
    ];
    const restRanking = ranking.filter((entry) => entry.rank > 3);

    return (
        <aside className="w-full shrink-0 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:w-56">
            <nav className="flex gap-1 rounded-full bg-slate-100 p-1">
                <button
                    type="button"
                    onClick={() => setTab("DAILY")}
                    className={`flex-1 cursor-pointer rounded-full py-1.5 text-xs font-black transition ${
                        tab === "DAILY"
                            ? "bg-white text-indigo-500 shadow-sm"
                            : "text-slate-400 hover:text-slate-600"
                    }`}
                >
                    일간랭킹
                </button>
                <button
                    type="button"
                    onClick={() => setTab("MONTHLY")}
                    className={`flex-1 cursor-pointer rounded-full py-1.5 text-xs font-black transition ${
                        tab === "MONTHLY"
                            ? "bg-white text-indigo-500 shadow-sm"
                            : "text-slate-400 hover:text-slate-600"
                    }`}
                >
                    월간랭킹
                </button>
            </nav>

            {ranking.length === 0 ? (
                <div className="flex h-40 items-center justify-center text-center text-sm font-bold text-slate-400">
                    아직 랭킹 정보가 없습니다.
                </div>
            ) : (
                <>
                    <div className="mt-6 flex items-end justify-center gap-2">
                        {second && <StudyRankUserItem entry={second} variant="podium" />}
                        {first && <StudyRankUserItem entry={first} variant="podium" />}
                        {third && <StudyRankUserItem entry={third} variant="podium" />}
                    </div>

                    {restRanking.length > 0 && (
                        <div className="mt-4 space-y-1 border-t border-slate-100 pt-3">
                            {restRanking.map((entry) => (
                                <StudyRankUserItem
                                    key={entry.userId}
                                    entry={entry}
                                    variant="list"
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </aside>
    );
}
