"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useChatBotMessages } from "../hooks/useChatBotMessages";
import ChatBotMessageBubble from "./ChatBotMessageBubble";
import UserMessageBubble from "./UserMessageBubble";
import StreamingIndicator from "./StreamingIndicator";
import STTTriggerButton from "./STTTriggerButton";
import UsageDonutChart from "./UsageDonutChart";
import type { ChatUsageInfo } from "../type";

// 실제 백엔드 연동 시 서버에서 받아온 모델명/사용량으로 교체
const MOCK_USAGE: ChatUsageInfo = {
    modelName: "gemini-3.1-flash-lite",
    dailyLimit: 100,
    dailyUsed: 62,
};

interface ChatBotTextareaProps {
    onClose: () => void;
}

export default function ChatBotTextarea({ onClose }: ChatBotTextareaProps) {
    const { messages, streamingText, isChatting, sendMessage } = useChatBotMessages();
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    // 새 메시지/스트리밍 갱신 시 항상 맨 아래로 스크롤
    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    }, [messages, streamingText]);

    const handleSubmit = () => {
        if (!input.trim() || isChatting) return;
        void sendMessage(input);
        setInput("");
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // 전송 버튼 없이 Enter로만 전송, Shift+Enter는 줄바꿈
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
        }
    };

    // STT로 인식이 끝나면 인풋에 채우기만 하지 않고, 인식된 텍스트로 바로 질문을 전송한다
    const handleSTTResult = (text: string) => {
        const combined = `${input}${text}`.trim();
        setInput("");
        if (combined && !isChatting) {
            void sendMessage(combined);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 top-[72px] z-[100] flex w-[min(50vw,480px)] min-w-[360px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-3">
                <span className="text-sm font-semibold text-slate-800">모모 챗봇</span>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="챗봇 닫기"
                    className="ml-auto flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            <div ref={scrollRef} className="flex flex-1 flex-col gap-3 overflow-y-auto overflow-x-hidden bg-slate-50 px-4 py-4">
                <div className="flex justify-center">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-center text-[11px] text-slate-400">
                        이 대화는 서버에 저장되지 않습니다. 탭을 닫으면 대화 내용이 사라집니다.
                    </span>
                </div>

                {messages.map((message) =>
                    message.role === "assistant" ? (
                        <ChatBotMessageBubble key={message.id} message={message} />
                    ) : (
                        <UserMessageBubble key={message.id} message={message} />
                    )
                )}

                {isChatting && <StreamingIndicator text={streamingText} />}
            </div>

            <div className="border-t border-slate-200 bg-white px-4 py-3">
                <div className="flex items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <Textarea
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={isChatting ? "답변을 기다리는 중..." : "질문을 입력하고 Enter로 전송..."}
                        rows={1}
                        disabled={isChatting}
                        className="min-h-6 resize-none border-none bg-transparent px-0 py-0 text-[13px] text-slate-800 shadow-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                    <STTTriggerButton onResult={handleSTTResult} disabled={isChatting} />
                </div>

                <div className="mt-1.5 flex justify-end">
                    <UsageDonutChart usage={MOCK_USAGE} />
                </div>
            </div>
        </div>
    );
}
