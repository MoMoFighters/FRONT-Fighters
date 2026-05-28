'use client'

import { PlusCircle } from 'lucide-react'

import {
    startTransition,
    useActionState,
    useEffect,
    useState,
} from 'react'

import {
    createTodoAction,
} from '../../action'


interface Props {
    selectedDate: string;
    noTodo: boolean;
}


export default function AddTodoArea({
    selectedDate,
    noTodo,
}: Props) {

    const [
        isAdding,
        setIsAdding,
    ] = useState(false)


    const [
        title,
        setTitle,
    ] = useState('')


    // action state
    const [
        state,
        formAction,
        pending,
    ] = useActionState(
        createTodoAction,
        {
            success: false,
            message: '',
        }
    )


    // 성공 시 input 초기화
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

        const formData =
            new FormData()

        formData.append('title', title)

        formData.append('start', selectedDate)

        startTransition(() => {
            formAction(formData)
        })
    }


    if (!isAdding) {

        return (
            <>

                {noTodo ? (

                    <div className='text-center'>

                        <p className='font-bold text-slate-700'>
                            등록된 일정이 없습니다.
                        </p>

                    </div>

                ) : ''}


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

            </>
        )
    }


    return (
        <div className="
            border
            rounded-xl
            p-3
            flex
            items-center
            gap-3
        ">

            <input
                className="
                    flex-1
                    outline-none
                    font-bold
                "
                placeholder="일정을 입력하세요"
                value={title}
                onChange={(e) =>
                    setTitle(
                        e.target.value
                    )
                }
                autoFocus
            />


            <button
                onClick={handleAddTodo}
                disabled={pending}
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