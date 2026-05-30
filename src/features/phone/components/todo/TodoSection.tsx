import dayjs from 'dayjs'

import TodoItem from './TodoItem'
import AddTodoArea from './AddTodoArea'
import { ScheduleItem } from '../../todoType'



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
                <p className="text-2xl text-slate-900 text-center font-extrabold">
                    Todo
                </p>

                <h2 className="text-lg font-semibold text-right mr-1 text-slate-500">
                    {selectedDate}
                </h2>
            </div>

            {/* TODO LIST */}
            <div className="flex flex-col gap-2">
                {filteredTodos.map((todo) => (
                    <TodoItem
                        key={todo.calendarId}
                        todo={todo}
                    />
                ))}
            </div>


            {/* 추가 영역 */}
            <AddTodoArea
                selectedDate={selectedDate}
                noTodo={filteredTodos.length === 0 ? true : false}
            />

        </div>
    )
}