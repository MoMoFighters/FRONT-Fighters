"use client";

import { useState } from "react";
import { Sprout, X } from "lucide-react";
import MonthlyGrassPanel from "@/components/city/MonthlyGrassPanel";
import type { GrassLevel } from "@/components/mypage/GrassHeatmap";

interface FloatingGrassButtonProps {
    title: string;
    levelByDate: Record<string, GrassLevel>;
    colorScale: Record<GrassLevel, string>;
    tooltipLabel: string;
}

export default function FloatingGrassButton({
    title,
    levelByDate,
    colorScale,
    tooltipLabel,
}: FloatingGrassButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-5 left-4 z-30">
            {isOpen && (
                <div className="absolute bottom-14 left-0 w-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                    <div className="mb-3 flex items-center justify-between gap-4">
                        <p className="whitespace-nowrap text-sm font-black text-slate-900">
                            {title}
                        </p>

                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100"
                            aria-label="닫기"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    <MonthlyGrassPanel
                        levelByDate={levelByDate}
                        colorScale={colorScale}
                        tooltipLabel={tooltipLabel}
                    />
                </div>
            )}

            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label="잔디 보기"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition hover:bg-emerald-600"
            >
                <Sprout className="h-6 w-6" />
            </button>
        </div>
    );
}
