'use client'

import { PlusCircle } from 'lucide-react'
import {
    startTransition,
    useActionState,
    useEffect,
    useState,
} from 'react'

import { createTodoAction } from '../../../todo/action'

interface Props {
    selectedDate: string
}

export default function AddTodoArea({ selectedDate, }: Props) {

    const [isAdding, setIsAdding] =
        useState(false)

    const [title, setTitle] =
        useState('')

    const [
        state,
        formAction,
        pending,
    ] = useActionState(
        createTodoAction,
        {
            success: false, message: '',
        }
    )

    // 성공 시 닫기 + 초기화
    useEffect(() => {
        if (state.success) {
            setTitle('')
            setIsAdding(false)
        }

    }, [state.success])

    const handleAddTodo = () => {
        if (!title.trim()) {
            return
        }
        const formData = new FormData()
        formData.append('title', title)
        formData.append('start', selectedDate)
        startTransition(() => { formAction(formData) })
        setTitle("");
        setIsAdding(false);
    }

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        if (pending) { return }
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsAdding(false)
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
            onBlur={handleBlur}
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
                disabled={pending || !title.trim()}
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