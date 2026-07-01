'use client'

import { PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { createTodoAction } from '../../../calendar/action'
import { toast } from 'sonner'
import { getCalendarDailyQueryKey } from './calendarQueryKeys'

interface Props {
    selectedDate: string
}

export default function AddTodoArea({ selectedDate, }: Props) {
    const queryClient = useQueryClient()

    const [isAdding, setIsAdding] =
        useState(false)

    const [title, setTitle] =
        useState('')

    const [sending, isSending] = useState(false);


    const handleAddTodo = async () => {
        if (!title.trim()) {
            return
        }

        isSending(true)

        try {
            const result = await createTodoAction({
                title,
                start: selectedDate,
            })

            if (result.status !== 201) {
                toast.error(result.message)
                return
            }

            toast.success(result.message)
            setTitle("")
            setIsAdding(false)
            await queryClient.invalidateQueries({
                queryKey: getCalendarDailyQueryKey(selectedDate),
            })
        } finally {
            isSending(false)
        }
    }




    if (!isAdding) {
        return (
            <div className='flex items-center justify-center'>

                <button
                    className="
                        text-right
                        text-sm
                        text-gray-400
                        mt-2
                        cursor-pointer
                    "
                    onClick={() =>
                        setIsAdding(true)
                    }
                >
                    + 일정 추가하기
                </button>
            </div>
        )
    }

    return (
        <div
            className="border rounded-lg h-10 p-3 flex w-full items-center"
        >
            <input
                className="flex-1 outline-none font-bold text-sm"
                placeholder="일정을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleAddTodo()
                    }
                    if (e.key === 'Escape') {
                        setIsAdding(false)
                    }
                }}
                autoFocus
            />

            <button
                type="button"
                onClick={handleAddTodo}
                disabled={!title.trim() || sending}
                className="
                    text-sky-500
                    cursor-pointer
                    disabled:opacity-50
                "
            >
                <PlusCircle />
            </button>
        </div>
    )
}
