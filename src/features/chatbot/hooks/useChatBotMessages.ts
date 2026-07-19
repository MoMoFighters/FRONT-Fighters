"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "../type";

const STORAGE_KEY = "momocity-chatbot-messages";

function loadMessages(): ChatMessage[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = window.sessionStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
    } catch {
        return [];
    }
}

function saveMessages(messages: ChatMessage[]) {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

export function useChatBotMessages() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [streamingText, setStreamingText] = useState("");
    const [isChatting, setIsChatting] = useState(false);
    const hasHydrated = useRef(false);

    // 최초 마운트 시에만 localStorage에서 대화 기록 복원 (서버/클라이언트 렌더 불일치 방지)
    useEffect(() => {
        setMessages(loadMessages());
        hasHydrated.current = true;
    }, []);

    const pushMessage = useCallback((message: ChatMessage) => {
        setMessages((prev) => {
            const next = [...prev, message];
            saveMessages(next); // 메시지 한 건이 완성될 때만 저장, 스트리밍 중간엔 저장하지 않는다
            return next;
        });
    }, []);

    const sendMessage = useCallback(
        async (content: string) => {
            const trimmed = content.trim();
            if (!trimmed || isChatting) return;

            pushMessage({
                id: crypto.randomUUID(),
                role: "user",
                content: trimmed,
                createdAt: Date.now(),
            });

            setIsChatting(true);
            setStreamingText("");

            try {
                const response = await fetch("/api/chat/stream", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: trimmed }),
                });

                if (!response.ok || !response.body) {
                    throw new Error("챗봇 응답을 받아오지 못했습니다.");
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let fullText = "";

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split("\n");

                    for (const line of lines) {
                        if (!line.startsWith("data: ")) continue;
                        const data = line.slice(6).trim();
                        if (!data) continue;

                        try {
                            const json = JSON.parse(data) as { content?: string };
                            if (json.content) {
                                fullText += json.content;
                                setStreamingText(fullText); // 임시 스트리밍 상태, localStorage엔 저장하지 않음
                            }
                        } catch {
                            // 빈 줄 등 파싱 실패는 무시
                        }
                    }
                }

                pushMessage({
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: fullText,
                    createdAt: Date.now(),
                });
            } catch {
                pushMessage({
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: "죄송해요, 답변을 가져오는 중 오류가 발생했어요.",
                    createdAt: Date.now(),
                });
            } finally {
                setStreamingText("");
                setIsChatting(false);
            }
        },
        [isChatting, pushMessage]
    );

    return { messages, streamingText, isChatting, sendMessage };
}
