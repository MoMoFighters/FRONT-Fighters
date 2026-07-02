'use client'

import dynamic from 'next/dynamic'
import { useCallback, useMemo, useState } from 'react'

import {
    useRouter,
    useSearchParams,
} from 'next/navigation'
import {
    useQuery,
    useQueryClient,
} from '@tanstack/react-query'

import { getMonthlyCalendarAction } from '@/features/calendar/action'

import type { ScheduleItem } from '../../../calendar/type'
import { getCalendarMonthQueryKey } from './calendarQueryKeys'

const FullCalendarMonthView = dynamic(
    () => import('./FullCalendarMonthView'),
    {
        ssr: false,
        loading: () => (
            <div className="flex h-full items-center justify-center text-sm font-bold text-slate-400">
                캘린더를 불러오는 중입니다.
            </div>
        ),
    }
)

const AddMemoModal = dynamic(
    () => import('./MemoModal'),
    {
        ssr: false,
    }
)

const MoreMemoModal = dynamic(
    () => import('@/components/phone/calendar/MoreMemoModal'),
    {
        ssr: false,
    }
)

interface Props {
    selectedDate: string
}

export interface CalendarMemoEvent {
    id: string
    title: string
    start: string
    end?: string
    extendedProps: {
        memo: ScheduleItem
    }
}

const formatLocalDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

const toFullCalendarEnd = (end?: string) => {
    if (!end) {
        return undefined
    }

    const [year, month, day] = end.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    date.setDate(date.getDate() + 1)

    return formatLocalDate(date)
}

const getCalendarMonth = (date: string) => date.slice(0, 7)

const EMPTY_SCHEDULES: ScheduleItem[] = []

export default function Calendar({
    selectedDate,
}: Props) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const queryClient = useQueryClient()

    const [visibleMonthDate, setVisibleMonthDate] = useState(selectedDate)
    const visibleMonth = getCalendarMonth(visibleMonthDate)

    const monthlySchedulesQuery = useQuery({
        queryKey: getCalendarMonthQueryKey(visibleMonth),
        queryFn: () => getMonthlyCalendarAction({
            date: visibleMonthDate,
        }),
        placeholderData: (previousData) => previousData,
    })

    const monthlySchedules = monthlySchedulesQuery.data ?? EMPTY_SCHEDULES

    const [isMemoModalOpen, setIsMemoModalOpen] = useState(false)
    const [createMemo, setCreateMemo] = useState(false)
    const [memoEditData, setMemoEditData] =
        useState<{ id: number; title: string; start: string; end: string | undefined }>
            ({ id: 0, title: "", start: "", end: undefined })

    const [moreOpen, setMoreOpen] = useState(false)
    const [moreDate, setMoreDate] = useState("")
    const [moreMemos, setMoreMemos] = useState<ScheduleItem[]>([])

    const events = useMemo<CalendarMemoEvent[]>(() => {
        return monthlySchedules.map((memo) => ({
            id: String(memo.calendarId),
            title: memo.title,
            start: memo.start,
            end: toFullCalendarEnd(memo.end),
            extendedProps: {
                memo,
            },
        }))
    }, [monthlySchedules])

    const updateVisibleMonth = useCallback((date: string) => {
        setVisibleMonthDate(date)
    }, [])

    const refreshMonthlySchedules = useCallback(async (date: string) => {
        const changedMonth = getCalendarMonth(date)

        await Promise.all([
            queryClient.invalidateQueries({
                queryKey: getCalendarMonthQueryKey(changedMonth),
            }),
            changedMonth === visibleMonth
                ? Promise.resolve()
                : queryClient.invalidateQueries({
                    queryKey: getCalendarMonthQueryKey(visibleMonth),
                }),
        ])
    }, [queryClient, visibleMonth])

    const updateSelectedDate = useCallback((date: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('month', date)

        router.push(`?${params.toString()}`)
    }, [router, searchParams])

    const handleOpenMemo = useCallback((memo: ScheduleItem) => {
        setIsMemoModalOpen(true)
        setCreateMemo(false)
        setMemoEditData({
            id: memo.calendarId,
            title: memo.title,
            start: memo.start,
            end: memo.end,
        })
    }, [])

    const handleAddMemo = useCallback(() => {
        setMemoEditData({
            id: 0,
            title: "",
            start: "",
            end: undefined,
        })
        setIsMemoModalOpen(true)
        setCreateMemo(true)
    }, [])

    const handleMoreClick = useCallback((date: string, memos: ScheduleItem[]) => {
        setMoreDate(date)
        setMoreMemos(memos)
        setMoreOpen(true)
    }, [])

    return (
        <>
            {isMemoModalOpen && (
                <AddMemoModal
                    setIsMemoModalOpen={setIsMemoModalOpen}
                    createMemo={createMemo}
                    onChanged={refreshMonthlySchedules}
                    data={createMemo ? undefined : memoEditData}
                />
            )}

            {moreOpen && (
                <MoreMemoModal
                    moreDate={moreDate}
                    moreMemos={moreMemos}
                    onClose={() => setMoreOpen(false)}
                    onSelectMemo={(memo) => {
                        setMoreOpen(false)
                        handleOpenMemo(memo)
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
                <FullCalendarMonthView
                    events={events}
                    selectedDate={selectedDate}
                    initialDate={selectedDate}
                    onDatesSet={updateVisibleMonth}
                    onDateClick={updateSelectedDate}
                    onEventClick={handleOpenMemo}
                    onMoreClick={handleMoreClick}
                    onAddMemo={handleAddMemo}
                />
            </div>
        </>
    )
}
