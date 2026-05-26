import dayjs from 'dayjs'

import TodoItem from './TodoItem'
import AddTodoArea from './AddTodoArea'

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
    selectedDate: string
    todos: ScheduleItem[]
}

export default function TodoSection({
    selectedDate,
    todos,
}: Props) {

    const filteredTodos = todos.filter(
        (todo) =>
            dayjs(todo.start).format('YYYY-MM-DD') ===
            selectedDate
    )

    return (
        <div className="p-4 flex flex-col gap-3">

            {/* 날짜 */}
            <div>
                <p className="text-sm text-gray-400">
                    선택 날짜
                </p>

                <h2 className="text-2xl font-bold">
                    {selectedDate}
                </h2>
            </div>

            {/* TODO LIST */}
            <div className="flex flex-col gap-2">

                {filteredTodos.map((todo) => (
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                    />
                ))}

            </div>

            {/* 추가 영역 */}
            <AddTodoArea
                selectedDate={selectedDate}
            />

        </div>
    )
}