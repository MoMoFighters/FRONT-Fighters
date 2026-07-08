'use client'

import dynamic from 'next/dynamic'

interface CalendarLoaderProps {
    selectedDate: string
}

const Calendar = dynamic(
    () => import('./Calendar'),
    {
        ssr: false,
        loading: () => (
            <div className="
                flex-1
                min-h-0
                min-w-0
                p-4
                border-r
                overflow-hidden
                scrollbar-none
            ">
                <div className="flex h-full items-center justify-center text-sm font-bold text-slate-400">
                    캘린더를 불러오는 중입니다.
                </div>
            </div>
        ),
    }
)

export default function CalendarLoader({
    selectedDate,
}: CalendarLoaderProps) {
    return (
        <Calendar
            selectedDate={selectedDate}
        />
    )
}
