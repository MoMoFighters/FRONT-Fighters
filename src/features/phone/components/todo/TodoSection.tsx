import dayjs from 'dayjs'

import TodoItem from './TodoItem'
import AddTodoArea from './AddTodoArea'
import { ScheduleItem } from '../../../calendar/type'



interface Props {
    selectedDate: string
    todos: ScheduleItem[]
    isLoading?: boolean
}

export default function TodoSection({
    selectedDate,
    todos,
    isLoading = false,
}: Props) {

    const filteredTodos = todos.filter(
        (todo) =>
            dayjs(todo.start).format('YYYY-MM-DD') ===
            selectedDate
    )

    return (
        <div className="p-4  flex flex-col gap-3 border-b border-slate-400 ml-3 h-[295px]">

            {/* 날짜 */}
            <div>
                <h2 className="text-xl text-slate-900 text-center font-bold">
                    할 일
                </h2>
            </div>

            {/* TODO LIST */}
            <div className="flex flex-col gap-2 h-full scrollbar-none overflow-auto w-full">
                {isLoading ? (
                    <div className="text-center h-full items-center flex justify-center">
                        <p className="font-bold text-slate-700">
                            불러오는 중입니다.
                        </p>
                    </div>
                ) : filteredTodos[0] ? (filteredTodos.map((todo) => (
                    <TodoItem
                        key={todo.calendarId}
                        todo={todo}
                        selectedDate={selectedDate}
                    />
                ))) : (<div className="text-center h-full items-center flex justify-center">
                    <p className="font-bold text-slate-700">
                        등록된 일정이 없습니다.
                    </p>
                </div>)}
                <div className='w-69 h-14'>
                    <AddTodoArea
                        selectedDate={selectedDate}
                    />
                </div>
            </div>
            {/* 추가 영역 */}



        </div>
    )
}
