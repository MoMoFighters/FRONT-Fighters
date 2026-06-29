"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import streakDate from "@/app/assets/img/streak-date.png";
import { StreakResponse } from "@/features/city/type";
import { getFriendStreakAction, getMyStreakAction } from "@/features/city/action";
import { toast } from "sonner";

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

const getMonthKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;

const normalizeLevel = (level: string | number | undefined): StreakDay["level"] => {
  const parsedLevel = typeof level === "string"
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
        const legacyStreak = streak as { streakData?: string; streakDate?: string };
        const date = streak.date ?? legacyStreak.streakData ?? legacyStreak.streakDate;

        return date
          ? [date.slice(0, 10), normalizeLevel(streak.level)] as const
          : undefined;
      })
      .filter((streak): streak is readonly [string, StreakDay["level"]] => Boolean(streak)),
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
  userId,
}: MonthlyStreakGardenProps) {
  const today = new Date();
  const currentMonthStreak = initialStreak ?? {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    streaks: [],
  };
  const [selectedMonth, setSelectedMonth] = useState(
    () => new Date(currentMonthStreak.year, currentMonthStreak.month - 1, 1),
  );
  const [monthlyStreak, setMonthlyStreak] = useState(currentMonthStreak);
  const [isPending, startTransition] = useTransition();

  const year = selectedMonth.getFullYear();
  const month = selectedMonth.getMonth() + 1;
  const isCurrentMonth = getMonthKey(selectedMonth) === getMonthKey(today);
  const streakDays = useMemo(
    () => normalizeStreakData(monthlyStreak),
    [monthlyStreak],
  );

  const moveMonth = (offset: -1 | 1) => {
    const nextMonth = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth() + offset,
      1,
    );

    if (nextMonth > new Date(today.getFullYear(), today.getMonth(), 1)) {
      return;
    }

    startTransition(async () => {
      const nextYear = nextMonth.getFullYear();
      const nextMonthNumber = nextMonth.getMonth() + 1;
      const payload = {
        year: nextYear,
        month: nextMonthNumber,
      };
      const result = userId
        ? await getFriendStreakAction(userId, payload)
        : await getMyStreakAction(payload);

      if (!result.success || !result.data) {
        toast.error(result.message ?? "잔디 정보를 불러오지 못했습니다.");
        return;
      }

      setSelectedMonth(nextMonth);
      setMonthlyStreak(result.data);
    });
  };

  return (
    <>
      <div className="absolute bottom-[11%] left-[5.5%] z-10 h-[13.3cqw] w-[15cqw] -rotate-4">
        <Image src={streakDate} alt="잔디 전광판" fill className="object-contain" />

        <div className="absolute left-[52%] top-[42%] -translate-x-1/2 -translate-y-1/2">
          <div
            className="flex items-center justify-center text-[0.9cqw] font-black text-slate-950"
            style={{
              transform: "rotate(-17deg) skewX(-5deg) scaleY(0.92)",
              transformOrigin: "center",
            }}
          >
            <button
              type="button"
              onClick={() => moveMonth(-1)}
              disabled={isPending}
              aria-label="이전 달"
            >
              <ChevronLeft className={`size-[1.33cqw] ${isPending ? "text-slate-300" : "cursor-pointer text-slate-900 hover:scale-110"}`} />
            </button>

            <span className="min-w-[4.4cqw] text-center tracking-wide">
              {year}-{pad(month)}
            </span>

            <button
              type="button"
              onClick={() => moveMonth(1)}
              disabled={isCurrentMonth || isPending}
              aria-label="다음 달"
            >
              <ChevronRight className={`size-[1.33cqw] ${!isCurrentMonth && !isPending && "cursor-pointer  hover:scale-110"} ${isCurrentMonth || isPending ? "text-slate-300" : "text-slate-900"}`} />
            </button>
          </div>
        </div>
      </div >

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
            <HoverCardContent side="top" className="w-auto rounded-md px-2.5 py-1.5 text-xs">
              <div className="font-semibold text-slate-900">{date}</div>
              <div className="text-[11px] text-slate-500">level {level}</div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    </>
  );
}
