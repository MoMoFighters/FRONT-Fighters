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
    const [content, setContent] = useState("");
    const [isFocus, setIsFocus] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!content.trim() || !chatRoomId || isSending) return;

        setIsSending(true);
        const response = await sendMessageAction({ content, roomId: chatRoomId });

        if (response.status !== 201) {
            toast.error(response.message, { duration: 1000 });
            setIsSending(false);
            return;
        }

        setContent('');
        inputRef.current?.focus();
        setIsSending(false);
        setIsFocus(true);
    };

    useEffect(() => {
        setIsSending(false);
        setContent("");
        inputRef.current?.focus();
    }, [chatRoomId, isFocus]);

    return (
        <div className="flex flex-col bg-slate-50">
            <form className="flex flex-row px-3 py-2 gap-1" onSubmit={handleSubmit}>
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
                    type="submit"
                    disabled={isSending || !content.trim()}
                >
                    {isSending ? "전송중..." : "전송"}
                </Button>
            </form>
        </div>
    );
}