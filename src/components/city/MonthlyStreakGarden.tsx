"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import streakDate from "@/app/assets/img/streak-date.png";

interface StreakDay {
  date: string;
  level: 0 | 1 | 2 | 3 | 4;
}

interface MonthlyStreakResponse {
  year: number;
  month: number;
  streaks: StreakDay[];
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

const createDummyStreakData = (year: number, month: number): MonthlyStreakResponse => {
  const daysInMonth = new Date(year, month, 0).getDate();

  return {
    year,
    month,
    streaks: Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const level = ((day * 7 + month) % 5) as StreakDay["level"];

      return {
        date: `${year}-${pad(month)}-${pad(day)}`,
        level,
      };
    }),
  };
};

export default function MonthlyStreakGarden() {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const year = selectedMonth.getFullYear();
  const month = selectedMonth.getMonth() + 1;
  const monthlyStreak = createDummyStreakData(year, month);
  const isCurrentMonth = getMonthKey(selectedMonth) === getMonthKey(today);

  const moveMonth = (offset: -1 | 1) => {
    setSelectedMonth((current) => {
      const next = new Date(current.getFullYear(), current.getMonth() + offset, 1);

      if (next > new Date(today.getFullYear(), today.getMonth(), 1)) {
        return current;
      }

      return next;
    });
  };

  return (
    <>
      <div className="fixed bottom-11 left-20 h-40 w-50 -rotate-4">
        <Image src={streakDate} alt="잔디 전광판" fill className="object-contain" />

        <div className="absolute left-[52%] top-[41%] -translate-x-1/2 -translate-y-1/2">
          <div
            className="flex items-center justify-center text-[14px] font-black text-slate-950"
            style={{
              transform: "rotate(-17deg) skewX(-5deg) scaleY(0.92)",
              transformOrigin: "center",
            }}
          >
            <button
              type="button"
              onClick={() => moveMonth(-1)}
              aria-label="이전 달"
            >
              <ChevronLeft className="size-5 text-slate-900 hover:scale-110 cursor-pointer" />
            </button>

            <span className="min-w-14 text-center tracking-wide">
              {year}-{pad(month)}
            </span>

            <button
              type="button"
              onClick={() => moveMonth(1)}
              disabled={isCurrentMonth}
              aria-label="다음 달"
            >
              <ChevronRight className="size-5 text-slate-900 hover:scale-110 cursor-pointer" />
            </button>
          </div>
        </div>
      </div >

      <div
        className="fixed -bottom-1.5 left-46.5 grid grid-cols-7 grid-rows-5 gap-x-0.5 gap-y-1 rounded-sm bg-yellow-800/50 px-0.5 py-2"
        style={{
          transform: "rotate(-30deg) skewX(28deg) scaleY(0.72)",
          transformOrigin: "center",
        }}
      >
        {monthlyStreak.streaks.map(({ date, level }) => (
          <HoverCard key={date} openDelay={80} closeDelay={80}>
            <HoverCardTrigger asChild>
              <div
                className={`flex h-4 w-3 cursor-pointer items-center justify-center rounded-xs ${levelStyle[level]}`}
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
