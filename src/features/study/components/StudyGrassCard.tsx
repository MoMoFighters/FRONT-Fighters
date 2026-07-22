"use client";

import GrassHeatmap, { type GrassLevel } from "@/components/mypage/GrassHeatmap";

interface StudyGrassCardProps {
    year: number;
    levelByDate: Record<string, GrassLevel>;
    secondsByDate: Record<string, number>;
}

const STUDY_COLOR_SCALE: Record<GrassLevel, string> = {
    0: "bg-slate-100",
    1: "bg-emerald-200",
    2: "bg-emerald-400",
    3: "bg-emerald-600",
    4: "bg-emerald-800",
};

const formatDateLabel = (date: string, isToday: boolean) => {
    if (isToday) return "오늘";
    const [, month, day] = date.split("-");
    return `${Number(month)}월 ${Number(day)}일`;
};

export default function StudyGrassCard({
    year,
    levelByDate,
    secondsByDate,
}: StudyGrassCardProps) {
    return (
        <GrassHeatmap
            year={year}
            levelByDate={levelByDate}
            colorScale={STUDY_COLOR_SCALE}
            renderTooltip={(date, _level, isToday) => {
                const minutes = Math.round((secondsByDate[date] ?? 0) / 60);
                return `${formatDateLabel(date, isToday)} 학습 시간 : ${minutes}분`;
            }}
        />
    );
}
