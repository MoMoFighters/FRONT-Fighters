'use client'

import { useEffect, useMemo, useState } from 'react'

import {
    useRouter,
    useSearchParams,
} from 'next/navigation'

import type { EventApi } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

import { ScheduleItem } from '../../../calendar/type'
import AddMemoModal from './MemoModal'
import { format } from 'date-fns'
import MoreMemoModal from '@/components/phone/calendar/MoreMemoModal'
import { getMonthlyCalendarAction } from '@/features/calendar/action'

interface Props {
    selectedDate: string
}

export default function Calendar({
    selectedDate,
}: Props) {

    const router = useRouter()
    const searchParams =
        useSearchParams()

    const [currentSelectedDate, setCurrentSelectedDate] = useState(selectedDate)
    const [loadedMonth, setLoadedMonth] = useState("")
    const [monthlySchedules, setMonthlySchedules] =
        useState<ScheduleItem[]>([])

    const [isMemoModalOpen, setIsMemoModalOpen] = useState<boolean>(false);
    const [createMemo, setCreateMemo] = useState<boolean>(false)
    const [memoEditData, setMemoEditData] =
        useState<{ id: number; title: string; start: string; end: string | undefined }>
            ({ id: 0, title: "", start: "", end: undefined });

    const [moreOpen, setMoreOpen] = useState(false);
    const [moreDate, setMoreDate] = useState("");
    const [moreEvents, setMoreEvents] = useState<EventApi[]>([]);

    useEffect(() => {
        setCurrentSelectedDate(selectedDate)
    }, [selectedDate])

    const memos = useMemo(() => {
        return monthlySchedules
    }, [monthlySchedules])

    const toFullCalendarEnd = (end?: string) => {
        if (!end) return undefined;
        const date = new Date(`${end}T00:00:00`);
        date.setDate(date.getDate() + 1);
        return format(date, "yyyy-MM-dd");
    };

    const events = useMemo(() => {
        return memos.map((memo) => ({
            id: String(memo.calendarId),
            title: memo.title,
            start: memo.start,
            end: memo.end
                ? toFullCalendarEnd(memo.end)
                : undefined,
            extendedProps: {
                memo,
            },
        }));
    }, [memos]);

    const fetchMonthlyIfNeeded = async (date: string) => {
        const nextMonth = date.slice(0, 7)

        if (nextMonth === loadedMonth) {
            return
        }

        const nextMonthlySchedules =
            await getMonthlyCalendarAction({
                date,
            })

        setMonthlySchedules(nextMonthlySchedules)
        setLoadedMonth(nextMonth)
    }

    const updateSelectedDate = (date: string) => {
        setCurrentSelectedDate(date)

        const params = new URLSearchParams(searchParams.toString())
        params.set('month', date)

        router.push(`?${params.toString()}`)
    }

    return (
        <>
            {isMemoModalOpen && (
                <AddMemoModal
                    setIsMemoModalOpen={setIsMemoModalOpen}
                    createMemo={createMemo}
                    data={createMemo ? undefined : memoEditData}
                />
            )}

            {moreOpen && (
                <MoreMemoModal
                    moreDate={moreDate}
                    moreEvents={moreEvents}
                    onClose={() => setMoreOpen(false)}
                    onSelectMemo={(memo) => {
                        setMoreOpen(false);
                        setCreateMemo(false);
                        setMemoEditData({
                            id: memo.calendarId,
                            title: memo.title,
                            start: memo.start,
                            end: memo.end,
                        });
                        setIsMemoModalOpen(true);
                    }}
                />
            )}

            <div className="
                flex-1
                min-w-0
                p-4
                border-r
                overflow-auto
                scrollbar-none
            ">
                <FullCalendar
                    plugins={[
                        dayGridPlugin,
                        interactionPlugin,
                    ]}

                    initialView="dayGridMonth"

                    height="auto"

                    timeZone="local"

                    datesSet={(info) => {
                        const currentMonthDate =
                            format(info.view.currentStart, "yyyy-MM-dd")

                        void fetchMonthlyIfNeeded(currentMonthDate)
                    }}

                    dateClick={(info) => {
                        const clickedDate = info.dateStr
                        updateSelectedDate(clickedDate)
                    }}

                    events={events}

                    dayMaxEvents={2}

                    eventClick={(e) => {
                        const memo = e.event.extendedProps.memo as ScheduleItem;
                        setIsMemoModalOpen(true);
                        setCreateMemo(false);
                        setMemoEditData({
                            id: memo.calendarId,
                            title: memo.title,
                            start: memo.start,
                            end: memo.end,
                        });
                    }}

                    moreLinkClick={(info) => {
                        info.jsEvent.preventDefault();
                        info.jsEvent.stopPropagation();

                        setMoreDate(
                            info.date.toLocaleDateString("sv-SE")
                        );

                        setMoreEvents(
                            info.allSegs.map((seg) => seg.event)
                        );

                        setMoreOpen(true);
                        return "none";
                    }}

                    dayCellClassNames={(arg) => {

                        const cellDate =
                            arg.date
                                .toLocaleDateString(
                                    'sv-SE'
                                )

                        if (cellDate === currentSelectedDate
                        ) {
                            return ['selected-date-cell']
                        }

                        return []
                    }}

                    headerToolbar={{
                        left: "title",
                        center: "",
                        right: "addMemoButton today prev,next",
                    }}

                    customButtons={{
                        addMemoButton: {
                            text: "메모 추가",
                            click: () => {
                                setMemoEditData({
                                    id: 0,
                                    title: "",
                                    start: "",
                                    end: undefined,
                                });
                                setIsMemoModalOpen(true);
                                setCreateMemo(true);
                            },
                        },
                    }}
                />
            </div>
        </>
    )
}
