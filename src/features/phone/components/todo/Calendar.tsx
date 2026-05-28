'use client'

import { useMemo, useState } from 'react'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

import TodoSection from './TodoSection'

interface ScheduleItem {
    id: number
    userId: number

    start: string
    end: string | null

    title: string

    category: 'todo' | 'memo'

    isCompleted: boolean

    createdAt: string
}

interface Props {
    schedules: ScheduleItem[]
}

export default function Calendar({
    schedules,
}: Props) {

    const [selectedDate, setSelectedDate] =
        useState(() => new Date().toISOString().split('T')[0])

    const todos = useMemo(() => {
        return schedules.filter(
            (item) => item.category === 'todo'
        )
    }, [schedules])

    const events = useMemo(() => {
        return todos.map((todo) => ({
            id: String(todo.id),
            title: todo.title,
            start: todo.start,
            end: todo.end ?? todo.start,
        }))
    }, [todos])

    return (
        <div className="h-full flex overflow-hidden">

            {/* 캘린더 */}
            <div className="flex-1 min-w-0 p-4 border-r overflow-auto scrollbar-none">

                <FullCalendar
                    plugins={[
                        dayGridPlugin,
                        interactionPlugin,
                    ]}
                    initialView="dayGridMonth"
                    height="auto"
                    timeZone="local"
                    dateClick={(info) => {
                        setSelectedDate(info.dateStr)
                    }}
                    events={events}
                    dayMaxEvents={1}
                    dayCellClassNames={(arg) => {

                        const cellDate =
                            arg.date.toLocaleDateString('sv-SE')

                        if (cellDate === selectedDate) {
                            return ['selected-date-cell']
                        }

                        return []
                    }}

                />

            </div>

            {/* TODO */}
            <div className="w-[320px] shrink-0 overflow-y-auto">

                <TodoSection
                    selectedDate={selectedDate}
                    todos={todos}
                />

            </div>

        </div>
    )
}