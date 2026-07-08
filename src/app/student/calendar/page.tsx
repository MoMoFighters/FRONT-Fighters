import CalendarSide from '@/components/phone/calendar/CalendarSide';
import CalendarLoader from '@/features/phone/components/todo/CalendarLoader';
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
            `/student/calendar?month=${currentDate}`
        );
    }

    return (
        <div className=" 
              h-full
              flex
              overflow-hidden
        ">
            <CalendarLoader
                selectedDate={date}
            />

            <CalendarSide
                selectedDate={date}
            />
        </div>
    );
}
