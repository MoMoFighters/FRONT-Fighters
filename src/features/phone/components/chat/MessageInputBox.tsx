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

import { useActionState, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { sendMessageAction } from "../../chatAction";
import { toast } from "sonner";

interface Props {
    chatRoomId: number | null;
    reload: {
        reload: boolean;
        setReload: any;
    }

}

export default function MessageInputBox({ chatRoomId, reload }: Props) {

    const inputRef = useRef<HTMLInputElement>(null);
    const [isSending, setIsSending] = useState(false);
    const [content, setContent] = useState("")


    const handleSend = async () => {
        setIsSending(true)
        if (!content || !chatRoomId) { return }
        const response = await sendMessageAction({ content, roomId: chatRoomId });
        if (response.status !== 201) {
            toast.error(response.message, {
                duration: 1000
            })
            return
        }
        setContent('');
        setIsSending(false);
        reload.setReload(!reload.reload);
    }

    useEffect(() => {
        setIsSending(false);
        setContent("");
    }, [chatRoomId])

    return (
        <div className="flex flex-col bg-slate-50">
            {/* 2. form의 action 속성에 formAction 전달 */}
            <div className="flex flex-row px-3 py-2 gap-1">
                {/* Hidden input들로 roomId를 서버에 함께 전송 */}
                <input type="hidden" name="roomId" value={chatRoomId || ""} />

                <input
                    ref={inputRef}
                    type="text"
                    name="content"
                    className="flex-1 border border-slate-300 px-2 py-1 rounded-sm text-slate-700 focus:outline-none"
                    placeholder="내용을 입력하세요..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={isSending || !chatRoomId}
                />
                <Button
                    type="button"
                    disabled={isSending || !content}
                    onClick={handleSend}
                >
                    {isSending ? "전송중..." : "전송"}
                </Button>
            </div>
        </div>
    );
}