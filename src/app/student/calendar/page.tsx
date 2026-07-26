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
        <main className="mx-auto w-full max-w-360 px-4 py-8 md:px-12 md:py-12">
            <section className="flex h-[85vh] min-h-[620px] max-h-[85vh] w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row">
                <CalendarLoader
                    selectedDate={date}
                />

                <CalendarSide
                    selectedDate={date}
                />
            </section>
        </main>
    );
}
