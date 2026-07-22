"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

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

interface GrassCellsProps {
    weeks: GrassWeek[];
    colorScale: Record<GrassLevel, string>;
    onCellEnter: (event: React.MouseEvent<HTMLDivElement>, cell: GrassCell) => void;
    onCellLeave: () => void;
}

// 부모의 툴팁 state가 바뀌어도, 이 그리드에 넘어오는 props(weeks/colorScale/콜백)가
// 참조 그대로면 React.memo가 재렌더 자체를 건너뛴다.
const GrassCells = memo(function GrassCells({
    weeks,
    colorScale,
    onCellEnter,
    onCellLeave,
}: GrassCellsProps) {
    return (
        <>
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
                                onMouseEnter={(event) => onCellEnter(event, cell)}
                                onMouseLeave={onCellLeave}
                                className={`h-[11px] w-[11px] shrink-0 rounded-[2px] transition-colors ${cell.date ? colorScale[cell.level] : "bg-transparent"
                                    } ${cell.date && !cell.isFuture ? "cursor-pointer" : ""}`}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
});

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

    // onMouseMove 대신 onMouseEnter(칸에 처음 들어올 때 1번)에서만 state 갱신
    const handleCellEnter = useCallback(
        (event: React.MouseEvent<HTMLDivElement>, cell: GrassCell) => {
            if (!cell.date || cell.isFuture) {
                setTooltip(null);
                return;
            }

            const rect = event.currentTarget.getBoundingClientRect();

            setTooltip({
                x: rect.left + rect.width / 2,
                y: rect.top,
                text: renderTooltip(cell.date, cell.level, cell.date === todayKey),
            });
        },
        [renderTooltip, todayKey]
    );

    const handleCellLeave = useCallback(() => setTooltip(null), []);

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
                    className="flex min-w-0 flex-1 flex-col justify-end gap-[3px] overflow-x-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:bg-transparent"
                >
                    <GrassCells
                        weeks={weeks}
                        colorScale={colorScale}
                        onCellEnter={handleCellEnter}
                        onCellLeave={handleCellLeave}
                    />
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
