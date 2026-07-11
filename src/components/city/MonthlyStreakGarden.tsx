"use client";

import { useMemo } from "react";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { StreakResponse } from "@/features/city/type";

interface StreakDay {
    date: string;
    level: 0 | 1 | 2 | 3 | 4;
}

interface MonthlyStreakGardenProps {
    initialStreak?: StreakResponse;
    userId?: string;
}

const levelStyle: Record<StreakDay["level"], string> = {
    0: "bg-slate-100/85",
    1: "bg-lime-200/90",
    2: "bg-lime-400/90",
    3: "bg-lime-600/90",
    4: "bg-lime-800/90",
};

const pad = (value: number) => String(value).padStart(2, "0");

const normalizeLevel = (level: string | number | undefined): StreakDay["level"] => {
    const parsedLevel =
        typeof level === "string"
            ? Number(level.replace(/\D/g, ""))
            : Number(level ?? 0);

    if (parsedLevel >= 0 && parsedLevel <= 4) {
        return parsedLevel as StreakDay["level"];
    }

    return 0;
};

const normalizeStreakData = ({ year, month, streaks }: StreakResponse): StreakDay[] => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const streakLevelByDate = new Map(
        streaks
            .map((streak) => {
                const legacyStreak = streak as {
                    streakData?: string;
                    streakDate?: string;
                };
                const date =
                    streak.date ?? legacyStreak.streakData ?? legacyStreak.streakDate;

                return date
                    ? ([date.slice(0, 10), normalizeLevel(streak.level)] as const)
                    : undefined;
            })
            .filter(
                (streak): streak is readonly [string, StreakDay["level"]] =>
                    Boolean(streak)
            )
    );

    return Array.from({ length: daysInMonth }, (_, index) => {
        const date = `${year}-${pad(month)}-${pad(index + 1)}`;

        return {
            date,
            level: streakLevelByDate.get(date) ?? 0,
        };
    });
};

export default function MonthlyStreakGarden({
    initialStreak,
}: MonthlyStreakGardenProps) {
    const today = new Date();
    const currentMonthStreak = initialStreak ?? {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        streaks: [],
    };

    const streakDays = useMemo(
        () => normalizeStreakData(currentMonthStreak),
        [currentMonthStreak]
    );

    return (
        <div
            className="absolute bottom-[8%] left-[13%] z-10 grid grid-cols-7 grid-rows-5 gap-x-[0.04cqw] gap-y-[0.08cqw] rounded-sm bg-yellow-800/50 px-[0.04cqw] py-[0.6cqw]"
            style={{
                transform: "rotate(-30deg) skewX(28deg) scaleY(0.72)",
                transformOrigin: "center",
            }}
        >
            {streakDays.map(({ date, level }) => (
                <HoverCard key={date} openDelay={80} closeDelay={80}>
                    <HoverCardTrigger asChild>
                        <div
                            className={`flex h-[1.25cqw] w-[0.94cqw] cursor-pointer items-center justify-center rounded-xs ${levelStyle[level]}`}
                        />
                    </HoverCardTrigger>
                    <HoverCardContent
                        side="top"
                        className="w-auto rounded-md px-2.5 py-1.5 text-xs"
                    >
                        <div className="font-semibold text-slate-900">{date}</div>
                        <div className="text-[11px] text-slate-500">level {level}</div>
                    </HoverCardContent>
                </HoverCard>
            ))}
        </div>
    );
}
