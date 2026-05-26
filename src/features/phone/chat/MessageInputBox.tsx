'use client'

import { Button } from "@/components/ui/button";
import { useState } from "react";


export default function MessageInputBox({ chatRoomId }: { chatRoomId: number }) {

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
                defaultValue={chatRoomId}
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
}