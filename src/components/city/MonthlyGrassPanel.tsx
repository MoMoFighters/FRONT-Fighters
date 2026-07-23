"use client";

import { useCallback, useMemo, useState } from "react";
import type { GrassLevel } from "@/components/mypage/GrassHeatmap";

interface GrassCell {
    date: string; // 빈 패딩 칸이면 ""
    level: GrassLevel;
}

interface GrassWeek {
    cells: GrassCell[];
}

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

const pad = (value: number) => String(value).padStart(2, "0");

// GrassHeatmap의 buildWeeks(연간)를 이번 달 하루~말일 범위로 축소한 버전.
// 1일의 요일에 맞춰 앞부분을 빈 칸으로 패딩해서 실제 요일 정렬을 유지한다.
const buildMonthWeeks = (
    year: number,
    month: number,
    levelByDate: Record<string, GrassLevel>
): GrassWeek[] => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstWeekday = new Date(year, month - 1, 1).getDay();

    const cells: GrassCell[] = [];

    for (let i = 0; i < firstWeekday; i++) {
        cells.push({ date: "", level: 0 });
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${pad(month)}-${pad(day)}`;
        cells.push({ date, level: levelByDate[date] ?? 0 });
    }

    while (cells.length % 7 !== 0) {
        cells.push({ date: "", level: 0 });
    }

    const weeks: GrassWeek[] = [];

    for (let i = 0; i < cells.length; i += 7) {
        weeks.push({ cells: cells.slice(i, i + 7) });
    }

    return weeks;
};

interface MonthlyGrassPanelProps {
    levelByDate: Record<string, GrassLevel>;
    colorScale: Record<GrassLevel, string>;
    tooltipLabel: string;
}

// 서버 컴포넌트에서 함수(renderTooltip)를 그대로 props로 내려받으면
// "Functions cannot be passed directly to Client Components" 에러가 나기 때문에,
// 툴팁 문구는 문자열 라벨만 받아서 클라이언트 쪽에서 직접 조립한다.
const formatTooltip = (date: string, level: GrassLevel, tooltipLabel: string) => {
    const [, month, day] = date.split("-");

    return `${Number(month)}월 ${Number(day)}일 ${tooltipLabel} : ${level}`;
};

export default function MonthlyGrassPanel({
    levelByDate,
    colorScale,
    tooltipLabel,
}: MonthlyGrassPanelProps) {
    const today = useMemo(() => new Date(), []);
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    const weeks = useMemo(
        () => buildMonthWeeks(year, month, levelByDate),
        [year, month, levelByDate]
    );

    const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

    const handleCellEnter = useCallback(
        (event: React.MouseEvent<HTMLDivElement>, cell: GrassCell) => {
            if (!cell.date) {
                setTooltip(null);
                return;
            }

            const rect = event.currentTarget.getBoundingClientRect();

            setTooltip({
                x: rect.left + rect.width / 2,
                y: rect.top,
                text: formatTooltip(cell.date, cell.level, tooltipLabel),
            });
        },
        [tooltipLabel]
    );

    const handleCellLeave = useCallback(() => setTooltip(null), []);

    return (
        <div className="relative w-fit">
            <div className="flex flex-col gap-[3px]">
                <div className="flex gap-[3px]">
                    {WEEKDAY_LABELS.map((label) => (
                        <span
                            key={label}
                            className="w-[13px] shrink-0 text-center text-[9px] font-bold text-slate-400"
                        >
                            {label}
                        </span>
                    ))}
                </div>

                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex gap-[3px]">
                        {week.cells.map((cell, dayIndex) => (
                            <div
                                key={dayIndex}
                                onMouseEnter={(event) => handleCellEnter(event, cell)}
                                onMouseLeave={handleCellLeave}
                                className={`h-[13px] w-[13px] shrink-0 rounded-[3px] transition-colors ${cell.date ? colorScale[cell.level] : "bg-transparent"
                                    } ${cell.date ? "cursor-pointer" : ""}`}
                            />
                        ))}
                    </div>
                ))}
            </div>

            {tooltip && (
                <div
                    className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-[calc(100%+8px)] whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[11px] font-bold text-white shadow-lg"
                    style={{ left: tooltip.x, top: tooltip.y }}
                >
                    {tooltip.text}
                </div>
            )}
        </div>
    );
}
