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

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { sendMessageAction } from "../../../chat/action";
import { toast } from "sonner";
import { Send } from "lucide-react";

interface Props {
    chatRoomId: number | null;
}

export default function MessageInputBox({ chatRoomId }: Props) {

    const inputRef = useRef<HTMLInputElement>(null);
    const [isSending, setIsSending] = useState(false);
    const [content, setContent] = useState("");

    const focusInput = () => {
        requestAnimationFrame(() => {
            inputRef.current?.focus();
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!content.trim() || !chatRoomId || isSending) return;

        setIsSending(true);
        const response = await sendMessageAction(chatRoomId, content);

        if (response.status !== 201) {
            toast.error(response.message, { duration: 1000 });
            setIsSending(false);
            focusInput();
            return;
        }

        setContent('');
        setIsSending(false);
        focusInput();
    };

    useEffect(() => {
        focusInput();
    }, [chatRoomId]);

    return (
        <div className="bg-white border-t border-slate-200">
            <form
                className="flex items-center gap-2 px-3 py-3"
                onSubmit={handleSubmit}
            >
                <input
                    ref={inputRef}
                    type="text"
                    name="content"
                    className="
                flex-1
                h-10
                px-4
                rounded-full
                bg-slate-100
                text-slate-700
                placeholder:text-slate-400
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-200
                transition-all
            "
                    placeholder="메시지를 입력하세요..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={isSending || !chatRoomId}
                    autoFocus={true}
                />

                <Button
                    type="submit"
                    disabled={isSending || !content.trim()}
                    className="
                h-10
                px-4
                rounded-full
                bg-indigo-500
                hover:bg-indigo-600
                text-white
                shadow-sm
                disabled:bg-slate-300
            "
                >
                    {/* {isSending ? "전송중..." : "전송"} */}
                    <Send />
                </Button>
            </form>
        </div>
    );
}
