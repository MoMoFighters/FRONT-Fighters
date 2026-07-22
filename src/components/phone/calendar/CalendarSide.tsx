"use client";

import { useQuery } from "@tanstack/react-query";

import { getDailyCalendarAction } from "@/features/calendar/action";
import TodayLectureSection from "./TodayLectureSection";
import TodoSection from "@/features/phone/components/todo/TodoSection";
import { getCalendarDailyQueryKey } from "@/features/phone/components/todo/calendarQueryKeys";

interface CalendarSideProps {
    selectedDate: string;
}

const EMPTY_DAILY_SCHEDULES = {
    todos: [],
    todayChapters: [],
};

export default function CalendarSide({
    selectedDate,
}: CalendarSideProps) {
    const dailySchedulesQuery = useQuery({
        queryKey: getCalendarDailyQueryKey(selectedDate),
        queryFn: () => getDailyCalendarAction({
            date: selectedDate,
        }),
        placeholderData: (previousData) => previousData,
    });

    const dailySchedules =
        dailySchedulesQuery.data ?? EMPTY_DAILY_SCHEDULES;

    return (
        <div className="
            w-full
            md:w-[320px]
            shrink-0
            grid
            grid-rows-[3fr_2fr]
            h-full
            overflow-hidden
        ">
            <TodoSection
                selectedDate={selectedDate}
                todos={dailySchedules.todos}
                isLoading={dailySchedulesQuery.isPending}
            />

            <TodayLectureSection
                todayLectures={dailySchedules.todayChapters}
            />
        </div>
    );
}
