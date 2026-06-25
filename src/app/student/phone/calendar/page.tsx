import CalendarSide from '@/components/phone/calendar/CalendarSide';
import Calendar from '@/features/phone/components/todo/Calendar';
import { redirect } from 'next/navigation';

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

    const today = new Date();

    const currentDate =
        `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    if (!month) {
        redirect(
            `/student/phone/calendar?month=${currentDate}`
        );
    }

    return (
        <div className=" 
             h-full
             flex
             overflow-hidden
        ">
            <Calendar
                selectedDate={date}
            />

            <CalendarSide
                selectedDate={date}
            />
        </div>
    );
}
