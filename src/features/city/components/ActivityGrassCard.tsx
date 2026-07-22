"use client";

import GrassHeatmap, { type GrassLevel } from "@/components/mypage/GrassHeatmap";

interface ActivityGrassCardProps {
    year: number;
    levelByDate: Record<string, GrassLevel>;
}

const ACTIVITY_COLOR_SCALE: Record<GrassLevel, string> = {
    0: "bg-slate-100",
    1: "bg-indigo-200",
    2: "bg-indigo-400",
    3: "bg-indigo-600",
    4: "bg-indigo-800",
};

const formatDateLabel = (date: string, isToday: boolean) => {
    if (isToday) return "오늘";
    const [, month, day] = date.split("-");
    return `${Number(month)}월 ${Number(day)}일`;
};

export default function ActivityGrassCard({
    year,
    levelByDate,
}: ActivityGrassCardProps) {
    return (
        <GrassHeatmap
            year={year}
            levelByDate={levelByDate}
            colorScale={ACTIVITY_COLOR_SCALE}
            renderTooltip={(date, level, isToday) =>
                `${formatDateLabel(date, isToday)} 활동 레벨 : ${level}`
            }
        />
    );
}
