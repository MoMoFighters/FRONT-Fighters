'use client'

import { useEffect, useMemo, useState } from 'react'

import {
    useRouter,
    useSearchParams,
} from 'next/navigation'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

import TodoSection from './TodoSection'
import { ScheduleItem } from '../../../todo/type'





interface Props {
    schedules: ScheduleItem[]
}


export default function Calendar({
    schedules,
}: Props) {

    const router = useRouter()

    const searchParams =
        useSearchParams()


    const initialDate =
        searchParams.get('month')
        ??
        new Date()
            .toISOString()
            .split('T')[0]


    const [
        selectedDate,
        setSelectedDate,
    ] = useState(initialDate)


    const todos = useMemo(() => {

        return schedules.filter(
            (item) =>
                item.category === 'TODO'
        )

    }, [schedules])

    useEffect(() => {
        router.push(`/student/phone/calendar?month=${initialDate}`)
    }, [initialDate])


    const events = useMemo(() => {

        return todos.map((todo) => ({
            id: String(todo.calendarId),

            title: todo.title,

            start: todo.start,

            end:
                todo.end
                ?? todo.start,
        }))

    }, [todos])


    return (
        <div className="
            h-full
            flex
            overflow-hidden
        ">

            {/* 캘린더 */}
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

                    dateClick={(info) => {

                        const clickedDate =
                            info.dateStr

                        // state 변경
                        setSelectedDate(
                            clickedDate
                        )

                        // query parameter 변경
                        const params =
                            new URLSearchParams(
                                searchParams.toString()
                            )

                        params.set(
                            'month',
                            clickedDate
                        )

                        router.push(
                            `?${params.toString()}`
                        )
                    }}

                    events={events}

                    dayMaxEvents={1}

                    dayCellClassNames={(arg) => {

                        const cellDate =
                            arg.date
                                .toLocaleDateString(
                                    'sv-SE'
                                )

                        if (
                            cellDate ===
                            selectedDate
                        ) {

                            return [
                                'selected-date-cell'
                            ]
                        }

                        return []
                    }}
                />

            </div>


            {/* TODO */}
            <div className="
                w-[320px]
                shrink-0
                overflow-y-auto
                grid
                grid-rows-[3fr_2fr]
            ">

                <TodoSection
                    selectedDate={
                        selectedDate
                    }
                    todos={todos}
                />
                <div className='flex flex-col p-2'>
                    <h2>오늘 들은 강의</h2>
                </div>

            </div>

        </div>
    )
}