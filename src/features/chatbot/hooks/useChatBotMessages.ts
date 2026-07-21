"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "../type";

const STORAGE_KEY = "momocity-chatbot-messages";

interface LiveUsage {
    callCount: number;
    dailyLimit: number;
    usagePercentage: number;
}

const ERROR_MESSAGES: Record<string, string> = {
    "CHATBOT-INVALID-QUESTION": "질문은 1자 이상 100자 이하로 입력해주세요.",
    "CHATBOT-DAILY-LIMIT-EXCEEDED": "오늘의 질문 횟수를 모두 사용했어요. 내일 다시 시도해주세요.",
    "CHATBOT-LECTURE-NOT-FOUND": "강의 정보를 찾을 수 없어요.",
    "CHATBOT-POLICY-SEARCH-FAILED": "일시적인 오류로 답변을 가져오지 못했어요.",
};

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

export const clearChatBotMessagesStorage = () => {
    if (typeof window === "undefined") {
        return;
    }

    window.sessionStorage.removeItem(STORAGE_KEY);
};

export function useChatBotMessages() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [streamingText, setStreamingText] = useState("");
    const [isChatting, setIsChatting] = useState(false);
    const [isDailyLimitExceeded, setIsDailyLimitExceeded] = useState(false);
    const [liveUsage, setLiveUsage] = useState<LiveUsage | null>(null);
    const hasHydrated = useRef(false);
    const pendingFaqTimeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

    // 컴포넌트가 언마운트되면 answerFaq에서 예약해둔 타이머를 전부 정리한다
    useEffect(() => {
        const pendingTimeouts = pendingFaqTimeoutsRef.current;

        return () => {
            pendingTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
            pendingTimeouts.clear();
        };
    }, []);

    // 최초 마운트 시에만 localStorage에서 대화 기록 복원 (서버/클라이언트 렌더 불일치 방지)
    // React Strict Mode에서 이 effect가 두 번 실행돼도 재복원하지 않도록 hasHydrated로 막는다
    // (안 막으면 두 번째 복원이 "아직 저장 전"의 빈 배열로 되돌려서, 마운트 직후 자동 전송되는
    // 사용자 메시지가 화면에서 사라지는 문제가 있었다)
    useEffect(() => {
        if (hasHydrated.current) return;
        hasHydrated.current = true;
        setMessages(loadMessages());
    }, []);

    const pushMessage = useCallback((message: ChatMessage) => {
        setMessages((prev) => {
            const next = [...prev, message];
            saveMessages(next); // 메시지 한 건이 완성될 때만 저장, 스트리밍 중간엔 저장하지 않는다
            return next;
        });
    }, []);

    const sendMessage = useCallback(
        async (content: string, lectureId?: number) => {
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
                    body: JSON.stringify({ message: trimmed, lectureId }),
                });

                if (!response.ok) {
                    const errorBody = await response.json().catch(() => null);

                    // 한도 초과는 이후 입력을 막을 수 있도록 상태로 노출
                    if (errorBody?.code === "CHATBOT-DAILY-LIMIT-EXCEEDED") {
                        setIsDailyLimitExceeded(true);
                    }

                    const errorText =
                        (errorBody?.code && ERROR_MESSAGES[errorBody.code]) ||
                        errorBody?.error ||
                        "답변을 가져오는 중 오류가 발생했어요.";

                    pushMessage({
                        id: crypto.randomUUID(),
                        role: "assistant",
                        content: errorText,
                        createdAt: Date.now(),
                    });
                    return;
                }

                if (!response.body) {
                    throw new Error("챗봇 응답을 받아오지 못했습니다.");
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let fullText = "";
                let streamError: string | null = null;
                let isStreamFinished = false; // done/error 수신 시 즉시 종료 처리용 플래그

                while (!isStreamFinished) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split("\n");

                    for (const line of lines) {
                        if (!line.startsWith("data:")) continue;
                        const data = line.slice(5).trim();
                        if (!data) continue;

                        try {
                            const json = JSON.parse(data) as { type?: string; content?: string };

                            if (json.type === "chunk" && json.content) {
                                fullText += json.content;
                                setStreamingText(fullText); // 임시 스트리밍 상태, localStorage엔 저장하지 않음
                            } else if (json.type === "error") {
                                streamError = json.content || "답변을 가져오는 중 오류가 발생했어요.";
                                isStreamFinished = true;
                                break;
                            } else if (json.type === "done") {
                                isStreamFinished = true; // 서버가 done 이후에도 연결을 유지할 수 있어 직접 끊는다
                                break;
                            }
                        } catch {
                            // 빈 줄 등 파싱 실패는 무시
                        }
                    }
                }

                await reader.cancel().catch(() => { }); // es.close()와 동일하게 연결을 명시적으로 정리

                pushMessage({
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: streamError ?? fullText,
                    createdAt: Date.now(),
                });
            } catch (error) {
                // 진단용 임시 로그 - 원인 파악 후 제거 예정
                console.error("[chatbot] sendMessage 예외 발생:", error);

                pushMessage({
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: "죄송해요, 답변을 가져오는 중 오류가 발생했어요.",
                    createdAt: Date.now(),
                });
            } finally {
                setStreamingText("");
                setIsChatting(false);

                // 페이지 전체를 새로고침(router.refresh)하지 않고, 사용량 숫자만 가볍게 다시 조회해서 갱신한다
                fetch("/api/chat/usage")
                    .then((res) => (res.ok ? res.json() : null))
                    .then((data) => {
                        if (data) setLiveUsage(data);
                    })
                    .catch(() => {});
            }
        },
        [isChatting, pushMessage]
    );

    // 자주 묻는 질문 버튼 전용: 서버 통신 없이 미리 정해둔 질문/답변을 그대로 대화창에 표시만 한다
    // (사용량에 영향 없음, PRO 여부와 무관하게 항상 사용 가능)
    const answerFaq = useCallback(
        (question: string, answer: string) => {
            pushMessage({
                id: crypto.randomUUID(),
                role: "user",
                content: question,
                createdAt: Date.now(),
            });

            // 답변이 바로 뜨면 부자연스러워서 짧은 텀을 둔다 (언마운트 시 정리를 위해 타이머 id를 추적)
            const timeoutId = setTimeout(() => {
                pendingFaqTimeoutsRef.current.delete(timeoutId);
                pushMessage({
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: answer,
                    createdAt: Date.now(),
                });
            }, 800);

            pendingFaqTimeoutsRef.current.add(timeoutId);
        },
        [pushMessage]
    );

    // 사용자가 직접 대화 내역을 지우는 기능 (세션스토리지 + 화면에 표시된 messages 둘 다 정리)
    const clearMessages = useCallback(() => {
        clearChatBotMessagesStorage();
        setMessages([]);
    }, []);

    return { messages, streamingText, isChatting, sendMessage, answerFaq, clearMessages, isDailyLimitExceeded, liveUsage };
}
