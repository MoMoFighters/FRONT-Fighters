import Calendar from "@/features/phone/todo/Calendar"


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

export default async function CalendarPage() {

    /*
      TODO:
      API 연동 예정
    */

    // const response = await fetch(...)
    // const schedules = await response.json()

    const schedules: ScheduleItem[] = [
        {
            id: 1,
            userId: 1,
            start: '2026-06-10',
            end: null,
            title: '수학 과제 하기',
            category: 'todo',
            isCompleted: false,
            createdAt: '2026-06-09',
        },

        {
            id: 2,
            userId: 1,
            start: '2026-06-10',
            end: null,
            title: '영단어 암기',
            category: 'todo',
            isCompleted: true,
            createdAt: '2026-06-09',
        },

        {
            id: 3,
            userId: 1,
            start: '2026-06-11',
            end: null,
            title: '헬스장 가기',
            category: 'todo',
            isCompleted: false,
            createdAt: '2026-06-09',
        },
    ]

    return (
        <Calendar schedules={schedules} />
    )
}