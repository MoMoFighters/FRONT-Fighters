"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type GrassLevel = 0 | 1 | 2 | 3 | 4;

interface GrassCell {
    date: string; // 빈 패딩 칸이면 ""
    level: GrassLevel;
    isFuture: boolean;
}

interface GrassWeek {
    monthLabel: string | null;
    cells: GrassCell[];
}

interface GrassHeatmapProps {
    year: number;
    levelByDate: Record<string, GrassLevel>;
    colorScale: Record<GrassLevel, string>;
    renderTooltip: (date: string, level: GrassLevel, isToday: boolean) => string;
}

const WEEKDAY_LABELS = ["", "월", "", "수", "", "금", ""]; // 일~토 순서, 월/수/금만 표시

const pad = (value: number) => String(value).padStart(2, "0");
const toDateKey = (date: Date) =>
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const buildWeeks = (
    year: number,
    levelByDate: Record<string, GrassLevel>
): GrassWeek[] => {
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);
    const todayKey = toDateKey(new Date());

    const cells: GrassCell[] = [];

    // 1월 1일 요일에 맞춰 일요일 시작 열의 앞부분을 빈 칸으로 채움
    for (let i = 0; i < start.getDay(); i++) {
        cells.push({ date: "", level: 0, isFuture: true });
    }

    for (let time = start.getTime(); time <= end.getTime(); time += 86400000) {
        const key = toDateKey(new Date(time));
        const isFuture = key > todayKey;

        cells.push({
            date: key,
            level: isFuture ? 0 : levelByDate[key] ?? 0,
            isFuture,
        });
    }

    const weeks: GrassWeek[] = [];
    let lastMonth = -1;

    for (let i = 0; i < cells.length; i += 7) {
        const weekCells = cells.slice(i, i + 7);
        const firstDated = weekCells.find((cell) => cell.date);
        let monthLabel: string | null = null;

        if (firstDated) {
            const month = Number(firstDated.date.slice(5, 7));
            if (month !== lastMonth) {
                monthLabel = `${month}월`;
                lastMonth = month;
            }
        }

        weeks.push({ monthLabel, cells: weekCells });
    }

    return weeks;
};

export default function GrassHeatmap({
    year,
    levelByDate,
    colorScale,
    renderTooltip,
}: GrassHeatmapProps) {
    const weeks = useMemo(() => buildWeeks(year, levelByDate), [year, levelByDate]);
    const todayKey = useMemo(() => toDateKey(new Date()), []);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

    useEffect(() => {
        // 오늘이 포함된 최신 주가 기본으로 보이도록 스크롤을 오른쪽 끝으로 이동
        const el = scrollRef.current;
        if (el) el.scrollLeft = el.scrollWidth;
    }, []);

    const handleHover = (event: React.MouseEvent<HTMLDivElement>, cell: GrassCell) => {
        if (!cell.date || cell.isFuture) {
            setTooltip(null);
            return;
        }

        // fixed 포지션이라 뷰포트 좌표(clientX/Y)를 그대로 사용 -> 조상의 overflow-hidden에 잘리지 않음
        setTooltip({
            x: event.clientX,
            y: event.clientY,
            text: renderTooltip(cell.date, cell.level, cell.date === todayKey),
        });
    };

    return (
        <div className="relative h-full w-full">
            <div className="flex h-full gap-1.5">
                <div className="flex shrink-0 flex-col justify-end gap-[3px] pt-[13px] text-[9px] font-bold leading-[11px] text-slate-400">
                    {WEEKDAY_LABELS.map((label, index) => (
                        <span key={index} className="h-[11px]">
                            {label}
                        </span>
                    ))}
                </div>

                <div
                    ref={scrollRef}
                    className="scrollbar-none flex flex-1 flex-col justify-end gap-[3px] overflow-x-auto"
                >
                    <div className="flex gap-[3px]">
                        {weeks.map((week, weekIndex) => (
                            <div key={weekIndex} className="relative h-[10px] w-[11px] shrink-0">
                                {week.monthLabel && (
                                    <span className="absolute left-0 top-0 whitespace-nowrap text-[9px] font-bold leading-[10px] text-slate-400">
                                        {week.monthLabel}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-[3px]">
                        {weeks.map((week, weekIndex) => (
                            <div key={weekIndex} className="flex flex-col gap-[3px]">
                                {week.cells.map((cell, dayIndex) => (
                                    <div
                                        key={dayIndex}
                                        onMouseEnter={(event) => handleHover(event, cell)}
                                        onMouseMove={(event) => handleHover(event, cell)}
                                        onMouseLeave={() => setTooltip(null)}
                                        className={`h-[11px] w-[11px] shrink-0 rounded-[2px] transition-colors ${cell.date ? colorScale[cell.level] : "bg-transparent"
                                            } ${cell.date && !cell.isFuture ? "cursor-pointer" : ""}`}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
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
