'use client'

import { useState } from 'react'

interface Props {
    selectedDate: string
}

export default function AddTodoArea({
    selectedDate,
}: Props) {

    const [isAdding, setIsAdding] =
        useState(false)

    const [title, setTitle] =
        useState('')

    const handleAddTodo = async () => {

        if (!title.trim()) return

        /*
          TODO:
          API 일정 추가 예정
    
          body:
          {
            start: selectedDate,
            title,
            category: 'todo'
          }
        */

        console.log({
            start: selectedDate,
            title,
        })

        setTitle('')
        setIsAdding(false)
    }

    if (!isAdding) {
        return (
            <button
                className="text-right text-sm text-gray-400 mt-2"
                onClick={() => setIsAdding(true)}
            >
                + 일정 추가하기
            </button>
        )
    }

    return (
        <div className="border rounded-xl p-3 flex items-center gap-3">

            <input
                className="flex-1 outline-none"
                placeholder="일정을 입력하세요"
                value={title}
                onChange={(e) =>
                    setTitle(e.target.value)
                }
                autoFocus
            />

            <button
                onClick={handleAddTodo}
                className="text-blue-500"
            >
                추가
            </button>

        </div>
    )
}