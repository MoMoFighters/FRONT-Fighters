import { getDailyCalendarAction } from "@/features/calendar/action";
import TodayLectureSection from "./TodayLectureSection";
import TodoSection from "@/features/phone/components/todo/TodoSection";

interface CalendarSideProps {
    selectedDate: string;
}

export default async function CalendarSide({
    selectedDate,
}: CalendarSideProps) {

    const dailySchedules =
        await getDailyCalendarAction({
            date: selectedDate,
        });

    return (
        <div className="
            w-[320px]
            shrink-0
            grid
            grid-rows-[3fr_2fr]
            h-full
            overflow-hidden
        ">
            <TodoSection
                selectedDate={selectedDate}
                todos={dailySchedules.todos}
            />

            <TodayLectureSection
                todayLectures={dailySchedules.todayChapters}
            />
        </div>
    );
}
