/*'use client'

import { Button } from "@/components/ui/button";
import { useState } from "react";


export default function MessageInputBox({ chatRoomId }: { chatRoomId: number | null }) {

    const messageSend = async () => {
        // chatRoomId랑 form 안에 값 넘겨서 
    }

    return (
        <form
            className="flex flex-row px-3 py-2 gap-1 bg-slate-50"
            onSubmit={messageSend}
        >
            <input
                type='hidden'
                name='roomId'
                defaultValue={chatRoomId || ""}
            />
            <input
                type="text"
                name='content'
                className="flex-1 border border-slate-300 px-1 rounded-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 transition-colors"
                placeholder="내용을 입력하세요..."
            />
            <Button>
                전송
            </Button>
        </form>
    );
}*/

'use client'

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { sendMessageAction } from "../../chatAction";

interface Props {
    chatRoomId: number | null;
}

export default function MessageInputBox({ chatRoomId }: Props) {
    // 1. useActionState에 액션과 초기값 바인딩
    const [state, formAction, isPending] = useActionState(sendMessageAction, {
        success: false,
        message: "",
    });

    const inputRef = useRef<HTMLInputElement>(null);

    // 메시지 전송 성공 시 입력창 비우기
    useEffect(() => {
        if (state.success && inputRef.current) {
            inputRef.current.value = "";
        }
    }, [state]);

    return (
        <div className="flex flex-col bg-slate-50">
            {/* 2. form의 action 속성에 formAction 전달 */}
            <form className="flex flex-row px-3 py-2 gap-1" action={formAction}>
                {/* Hidden input들로 roomId를 서버에 함께 전송 */}
                <input type="hidden" name="roomId" value={chatRoomId || ""} />

                <input
                    ref={inputRef}
                    type="text"
                    name="content"
                    className="flex-1 border border-slate-300 px-2 py-1 rounded-sm text-slate-700 focus:outline-none"
                    placeholder="내용을 입력하세요..."
                    disabled={isPending || !chatRoomId}
                />
                <Button type="submit" disabled={isPending || !chatRoomId}>
                    {isPending ? "전송중..." : "전송"}
                </Button>
            </form>

            {/* 에러 발생 시 사용자에게 문구 노출 */}
            {!state.success && state.message && (
                <p className="text-xs text-red-500 px-3 pb-1">{state.message}</p>
            )}
        </div>
    );
}