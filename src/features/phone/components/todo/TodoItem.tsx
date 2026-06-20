'use client'

import { useState } from 'react'

import clsx from 'clsx'
import { Edit, Trash2 } from 'lucide-react'
import DeleteModal from '@/features/modal/DeleteModal'
import { ScheduleItem } from '../../../calendar/type'
import { checkTodoAction, deleteTodoAction, editTodoAction } from '../../../calendar/action'



interface Props {
    todo: ScheduleItem
}

export default function TodoItem({
    todo,
}: Props) {

    const [checked, setChecked] = useState(todo.isCompleted)

    const [title, setTitle] = useState(todo.title)

    const [isEditing, setIsEditing] = useState(false)

    const handleDelete = async () => {
        await deleteTodoAction(todo.calendarId)
    }

    const handleToggle = async () => {

        const nextChecked =
            !checked;

        setChecked(nextChecked);

        const result =
            await checkTodoAction({
                calendarId:
                    todo.calendarId,

                isCompleted:
                    nextChecked,
            });


        // 실패 시 롤백
        if (!result.success) {

            setChecked(!nextChecked);

            alert(result.message);
        }
    };

    const handleEdit = async () => {
        await editTodoAction({
            calendarId:
                todo.calendarId,

            title: title,

            start:
                todo.start,
        })
        setIsEditing(false)
    }

    return (
        <div
            className={`w-full border border-slate-200 py-2 h-10 px-3 flex items-center gap-3 rounded-lg ${isEditing ? 'bg-slate-200/70' : ''}`}
        >
            <input
                type="checkbox"
                checked={checked}
                onChange={handleToggle}
            />

            {isEditing ? (
                <>
                    <input
                        className="flex-1 outline-none p-1 font-bold min-w-0 w-full"
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        onBlur={handleEdit}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleEdit();
                            }
                        }}
                        autoFocus
                    />
                    <button
                        onClick={handleEdit}
                        className="text-sm text-sky-500 mr-1"
                    >
                        <Edit className='w-5 h-5 cursor-pointer' />
                    </button>
                </>
            ) : (
                <>
                    <p
                        className={`min-w-0 flex-1 ${checked && 'line-through text-gray-400'} text-sm font-bold p-1`}
                        onClick={() => setIsEditing(true)}
                    >
                        {title}
                    </p>
                    <DeleteModal
                        title={`${title} 삭제`}
                        description="삭제하면 복구할 수 없습니다."
                        onDelete={handleDelete}
                        trigger={
                            <button className="text-sm text-red-500 mr-1">
                                <Trash2 className="w-5 h-5 cursor-pointer" />
                            </button>
                        }
                    />
                </>
            )}

            {/* <button
                onClick={handleDelete}
                className="text-sm text-red-500 mr-1"
            >
                <Trash2 className='w-5 h-5 cursor-pointer' />
            </button> */}

        </div>
    )
}