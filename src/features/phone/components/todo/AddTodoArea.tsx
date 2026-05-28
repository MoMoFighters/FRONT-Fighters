'use client'

import { PlusCircle } from 'lucide-react'
import { useState } from 'react'

interface Props {
    selectedDate: string;
    noTodo: boolean;
}

export default function AddTodoArea({
    selectedDate,
    noTodo
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
            <>
                {noTodo ? (
                    <div className='text-center'>
                        <p className='font-bold text-slate-700'>등록된 일정이 없습니다.</p>
                    </div>
                ) : ""}

                <button
                    className="text-right text-sm text-gray-400 mt-2 cursor-pointer"
                    onClick={() => setIsAdding(true)}
                >
                    + 일정 추가하기
                </button>
            </>
        )
    }

    return (
        <div className="border rounded-xl p-3 flex items-center gap-3">

            <input
                className="flex-1 outline-none font-bold"
                placeholder="일정을 입력하세요"
                value={title}
                onChange={(e) =>
                    setTitle(e.target.value)
                }
                onBlur={() => setIsAdding(false)}
                autoFocus
            />

            <button
                onClick={handleAddTodo}
                className="text-sky-500 cursor-pointer"
            >
                <PlusCircle />
            </button>

        </div>
    )
}