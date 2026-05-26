'use client'

import { useState } from 'react'

import clsx from 'clsx'

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

    const [checked, setChecked] =
        useState(todo.isCompleted)

    const [title, setTitle] =
        useState(todo.title)

    const [isEditing, setIsEditing] =
        useState(false)

    const handleDelete = async () => {

        /*
          TODO:
          API 삭제 호출 예정
        */

        console.log('삭제')
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
            className={clsx(
                'border rounded-xl p-3 flex items-center gap-3',
                checked
                    ? 'bg-gray-100'
                    : 'bg-white'
            )}
        >

            <input
                type="checkbox"
                checked={checked}
                onChange={handleToggle}
            />

            {isEditing ? (
                <input
                    className="flex-1 outline-none"
                    value={title}
                    onChange={(e) =>
                        setTitle(e.target.value)
                    }
                    onBlur={handleEdit}
                    autoFocus
                />
            ) : (
                <p
                    className={clsx(
                        'flex-1',
                        checked &&
                        'line-through text-gray-400'
                    )}
                    onClick={() => setIsEditing(true)}
                >
                    {title}
                </p>
            )}

            <button
                onClick={handleDelete}
                className="text-sm text-red-500"
            >
                삭제
            </button>

        </div>
    )
}