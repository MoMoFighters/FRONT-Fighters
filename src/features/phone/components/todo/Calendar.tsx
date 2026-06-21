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

import TodoSection from './TodoSection'
import { ScheduleItem } from '../../../calendar/type'
import TodayLectureSection from '../../../../components/phone/calendar/TodayLectureSection'
import AddMemoModal from './MemoModal'
import { format } from 'date-fns'
import MoreMemoModal from '@/components/phone/calendar/MoreMemoModal'





interface Props {
    schedules: ScheduleItem[]
}


export default function Calendar({
    schedules,
}: Props) {

    // searchParams에 선택된 날짜 넘기고, 기본값을 오늘 날짜로 선택하기 위함
    const router = useRouter()
    const searchParams =
        useSearchParams()
    const initialDate =
        searchParams.get('month')
        ??
        new Date()
            .toISOString()
            .split('T')[0]
    const [selectedDate, setSelectedDate,] = useState(initialDate)
    useEffect(() => {
        router.push(`/student/phone/calendar?month=${initialDate}`)
    }, [initialDate])

    // 메모 추가 수정 삭제용 모달
    const [isMemoModalOpen, setIsMemoModalOpen] = useState<boolean>(false);
    const [createMemo, setCreateMemo] = useState<boolean>(false)
    const [memoEditData, setMemoEditData] =
        useState<{ id: number; title: string; start: string; end: string | undefined }>
            ({ id: 0, title: "", start: "", end: undefined });

    // 날짜 더보기 커스텀 모달
    const [moreOpen, setMoreOpen] = useState(false);
    const [moreDate, setMoreDate] = useState("");
    const [moreEvents, setMoreEvents] = useState<EventApi[]>([]);

    // 메모(데이터 통신용)
    const memos = useMemo(() => {
        return schedules.filter(
            (item) =>
                item.category === 'MEMO'
        )
    }, [schedules])

    // 풀캘린더의 end가 exclusiveEnd 설정이라 원하는대로 설정되지 않는 것을 방지
    const toFullCalendarEnd = (end?: string) => {
        if (!end) return undefined;
        const date = new Date(`${end}T00:00:00`);
        date.setDate(date.getDate() + 1);
        return format(date, "yyyy-MM-dd");
    };

    // 풀캘린더에 넘길 memos
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

    // 추후 API 수정 시 todos랑 오늘들은 강의는 그쪽으로 넘겨서 거기서 데이터페칭해야함
    const todos = useMemo(() => {
        return schedules.filter(
            (item) =>
                item.category === 'TODO'
        )
    }, [schedules])


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
                            const clickedDate = info.dateStr
                            // state 변경
                            setSelectedDate(clickedDate)
                            // query parameter 변경
                            const params = new URLSearchParams(searchParams.toString())
                            params.set('month', clickedDate)
                            router.push(`?${params.toString()}`)
                        }}

                        // 달력에 표시될 메모 데이터
                        events={events}
                        // 한 날짜에 메모 최대 개수
                        dayMaxEvents={2}

                        // 메모 상세조회
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

                        // +more 클릭
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

                            if (cellDate === selectedDate
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



                {/* TODO 및 오늘 들은 강의 (우측 섹션)*/}
                <div className="
                w-[320px]
                shrink-0
                grid
                grid-rows-[3fr_2fr]
                h-full
                overflow-hidden
            ">

                    <TodoSection
                        selectedDate={
                            selectedDate
                        }
                        todos={todos}
                    />
                    <TodayLectureSection />

                </div>

            </div>
        </>
    )
}
