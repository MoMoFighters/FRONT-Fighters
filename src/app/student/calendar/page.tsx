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
        <div className="flex h-[calc(100vh-55px)] max-h-[calc(100vh-55px)] min-h-0 w-full flex-col overflow-hidden p-4 md:p-8">
            <div className="flex h-full min-h-0 w-full flex-col gap-4 overflow-hidden md:flex-row">
                <div className="min-h-0 min-w-0 flex-1 overflow-hidden rounded-md border border-slate-200 bg-white">
                    <CalendarLoader
                        selectedDate={date}
                    />
                </div>

                <div className="min-h-0 overflow-hidden rounded-md border border-slate-200 bg-white">
                    <CalendarSide
                        selectedDate={date}
                    />
                </div>
            </div>
        </div>
    );
}
