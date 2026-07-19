'use client'

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { sendMessageAction } from "../../../chat/action";
import { toast } from "sonner";
import { Send } from "lucide-react";
import STTTriggerButton from "@/features/chatbot/components/STTTriggerButton";

const TYPING_STOP_DELAY_MS = 3000;

interface Props {
    chatRoomId: number | null;
    onTypingChange?: (isTyping: boolean) => void;
}

export default function MessageInputBox({ chatRoomId, onTypingChange }: Props) {

    const inputRef = useRef<HTMLInputElement>(null);
    const [isSending, setIsSending] = useState(false);
    const [content, setContent] = useState("");
    const isTypingRef = useRef(false);
    const typingTimeoutRef = useRef<number | null>(null);

    const focusInput = () => {
        requestAnimationFrame(() => {
            inputRef.current?.focus();
        });
    };

    const stopTyping = () => {
        if (typingTimeoutRef.current !== null) {
            window.clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }

        if (isTypingRef.current) {
            isTypingRef.current = false;
            onTypingChange?.(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setContent(value);

        if (!onTypingChange) return;

        if (!value.trim()) {
            stopTyping();
            return;
        }

        if (!isTypingRef.current) {
            isTypingRef.current = true;
            onTypingChange(true);
        }

        if (typingTimeoutRef.current !== null) {
            window.clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = window.setTimeout(
            stopTyping,
            TYPING_STOP_DELAY_MS
        );
    };

    const handleSTTResult = (text: string) => {
        setContent((prev) => (prev.trim() ? `${prev} ${text}` : text));
        focusInput();
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!content.trim() || !chatRoomId || isSending) return;

        stopTyping();
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

        return () => {
            stopTyping();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    onChange={handleChange}
                    disabled={isSending || !chatRoomId}
                    autoFocus={true}
                />

                <STTTriggerButton
                    onResult={handleSTTResult}
                    disabled={isSending || !chatRoomId}
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
