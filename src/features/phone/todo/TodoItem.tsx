'use client'

import { useState } from 'react'

import clsx from 'clsx'
import { Edit, Trash2 } from 'lucide-react'

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
    todo: ScheduleItem
}

export default function TodoItem({
    todo,
}: Props) {

    const [checked, setChecked] = useState(todo.isCompleted)

    const [title, setTitle] = useState(todo.title)

    const [isEditing, setIsEditing] = useState(false)

    const handleDelete = async () => {
        /*
          TODO:
          API 삭제 호출 예정
        */
    }

    const handleToggle = async () => {
        setChecked((prev) => !prev)
        /*
          TODO:
          API 완료상태 수정 예정
        */
    }

    const handleEdit = async () => {
        setIsEditing(false)
        /*
          TODO:
          API 제목 수정 예정
        */
    }

    return (
        <div
            className={`border-b border-slate-700 p-2 flex items-center gap-3 ${isEditing ? 'bg-slate-100' : ''}`}
        >
            <input
                type="checkbox"
                checked={checked}
                onChange={handleToggle}
            />

            {isEditing ? (
                <>
                    <input
                        className="flex-1 outline-none p-1 font-bold min-w-0"
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        onBlur={handleEdit}
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
                        className={`min-w-0 flex-1 ${checked && 'line-through text-gray-400'} font-bold p-1`}
                        onClick={() => setIsEditing(true)}
                    >
                        {title}
                    </p>
                    <button
                        onClick={handleDelete}
                        className="text-sm text-red-500 mr-1"
                    >
                        <Trash2 className='w-5 h-5 cursor-pointer' />
                    </button>
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