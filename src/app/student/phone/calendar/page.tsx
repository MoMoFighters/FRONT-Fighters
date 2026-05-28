
import { getCalendarSchedulesAction } from '@/features/phone/action';
import Calendar from '@/features/phone/components/todo/Calendar';
import { ScheduleItem } from '@/features/phone/type';



interface CalendarPageProps {
    searchParams: Promise<{
        month?: string;
    }>;
}

export default async function CalendarPage({
    searchParams,
}: CalendarPageProps) {

    const { month } = await searchParams;
    const date = month as string;




    const schedules = await getCalendarSchedulesAction({ date });

    console.log(schedules);

    return (
        <Calendar schedules={schedules} />
    );
} 