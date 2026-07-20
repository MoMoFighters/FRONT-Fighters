'use client'

import type {
    DatesSetArg,
    EventClickArg,
    MoreLinkArg,
} from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import type { DateClickArg } from '@fullcalendar/interaction'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import { memo, useCallback, useMemo, useRef } from 'react'

import type { ScheduleItem } from '@/features/calendar/type'

import type { CalendarMemoEvent } from './Calendar'

const FULL_CALENDAR_PLUGINS = [
    dayGridPlugin,
    interactionPlugin,
]

const HEADER_TOOLBAR = {
    left: "title",
    center: "",
    right: "addMemoButton today prev,next",
}

interface FullCalendarMonthViewProps {
    events: CalendarMemoEvent[]
    selectedDate: string
    initialDate: string
    onDatesSet: (date: string) => void
    onDateClick: (date: string) => void
    onEventClick: (memo: ScheduleItem) => void
    onMoreClick: (date: string, memos: ScheduleItem[]) => void
    onAddMemo: () => void
}

const formatLocalDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

function FullCalendarMonthView({
    events,
    selectedDate,
    initialDate,
    onDatesSet,
    onDateClick,
    onEventClick,
    onMoreClick,
    onAddMemo,
}: FullCalendarMonthViewProps) {
    const calendarRef = useRef<FullCalendar>(null)

    const handleTodayClick = useCallback(() => {
        const calendarApi = calendarRef.current?.getApi()

        calendarApi?.today()
        onDateClick(formatLocalDate(new Date()))
    }, [onDateClick])

    const customButtons = useMemo(() => ({
        addMemoButton: {
            text: "메모 추가",
            click: onAddMemo,
        },
        today: {
            text: "today",
            click: handleTodayClick,
        },
    }), [onAddMemo, handleTodayClick])

    const handleDatesSet = useCallback((info: DatesSetArg) => {
        onDatesSet(formatLocalDate(info.view.currentStart))
    }, [onDatesSet])

    const handleDateClick = useCallback((info: DateClickArg) => {
        onDateClick(info.dateStr)
    }, [onDateClick])

    const handleEventClick = useCallback((info: EventClickArg) => {
        onEventClick(info.event.extendedProps.memo as ScheduleItem)
    }, [onEventClick])

    const handleMoreLinkClick = useCallback((info: MoreLinkArg) => {
        info.jsEvent.preventDefault()
        info.jsEvent.stopPropagation()

        onMoreClick(
            formatLocalDate(info.date),
            info.allSegs.map((seg) => (
                seg.event.extendedProps.memo as ScheduleItem
            ))
        )

        return "none"
    }, [onMoreClick])

    const dayCellClassNames = useCallback((arg: { date: Date }) => {
        if (formatLocalDate(arg.date) === selectedDate) {
            return ['selected-date-cell']
        }

        return []
    }, [selectedDate])

    return (
        <FullCalendar
            ref={calendarRef}
            plugins={FULL_CALENDAR_PLUGINS}
            initialView="dayGridMonth"
            initialDate={initialDate}
            height="100%"
            timeZone="local"
            datesSet={handleDatesSet}
            dateClick={handleDateClick}
            events={events}
            dayMaxEvents={2}
            eventClick={handleEventClick}
            moreLinkClick={handleMoreLinkClick}
            dayCellClassNames={dayCellClassNames}
            headerToolbar={HEADER_TOOLBAR}
            customButtons={customButtons}
        />
    )
}

export default memo(FullCalendarMonthView)
