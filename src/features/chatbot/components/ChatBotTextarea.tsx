"use client";

import { useEffect, useRef, useState } from "react";
import { BrushCleaning, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useChatBotMessages } from "../hooks/useChatBotMessages";
import ChatBotMessageBubble from "./ChatBotMessageBubble";
import UserMessageBubble from "./UserMessageBubble";
import StreamingIndicator from "./StreamingIndicator";
import STTTriggerButton from "./STTTriggerButton";
import UsageDonutChart from "./UsageDonutChart";
import MembershipRequiredModal from "./MembershipRequiredModal";
import ChatBotFaqIntro from "./ChatBotFaqIntro";
import { FAQ_TOPICS, type FaqTopic } from "../faqData";
import type { ChatUsageInfo } from "../type";
import type { Membership } from "@/features/user/type";

const MAX_QUESTION_LENGTH = 100;

interface ChatBotTextareaProps {
    onClose: () => void;
    usage: ChatUsageInfo;
    membership: Membership;
    lectureId?: number;
    autoQuestion?: string;
    onAutoQuestionHandled?: () => void;
}

export default function ChatBotTextarea({
    onClose,
    usage,
    membership,
    lectureId,
    autoQuestion,
    onAutoQuestionHandled,
}: ChatBotTextareaProps) {
    const { messages, streamingText, isChatting, sendMessage, answerFaq, clearMessages, isDailyLimitExceeded, liveUsage } = useChatBotMessages();
    const [input, setInput] = useState("");
    const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const hasSentAutoQuestion = useRef(false);

    const isPro = membership === "PRO";

    // 메시지 전송 후 서버에서 다시 받아온 최신 사용량이 있으면 그걸 우선 사용 (없으면 최초 진입 시 값)
    const effectiveUsage: ChatUsageInfo = liveUsage
        ? {
            modelName: usage.modelName,
            dailyLimit: liveUsage.dailyLimit,
            dailyUsed: liveUsage.callCount,
            usagePercentage: liveUsage.usagePercentage,
        }
        : usage;

    // 오늘 사용량이 이미 한도에 도달한 채로 열렸거나, 세션 중 한도를 채운 경우 모두 감지
    const isLimitReached = effectiveUsage.dailyUsed >= effectiveUsage.dailyLimit || isDailyLimitExceeded;

    // 새 메시지/스트리밍 갱신 시 항상 맨 아래로 스크롤
    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    }, [messages, streamingText]);

    // 강의 상세 페이지 트리거로 열렸을 때 딱 한 번만 자동 질문 전송 (PRO가 아니거나 한도 초과 시 생략)
    useEffect(() => {
        if (!autoQuestion || hasSentAutoQuestion.current || isLimitReached) return;

        if (!isPro) {
            setIsMembershipModalOpen(true);
            onAutoQuestionHandled?.();
            return;
        }

        hasSentAutoQuestion.current = true;
        void sendMessage(autoQuestion, lectureId);
        onAutoQuestionHandled?.();
    }, [autoQuestion, lectureId, sendMessage, onAutoQuestionHandled, isLimitReached, isPro]);

    const handleSubmit = () => {
        const trimmed = input.trim();
        if (!trimmed || trimmed.length > MAX_QUESTION_LENGTH || isChatting || isLimitReached) return;
        void sendMessage(trimmed, lectureId);
        setInput("");
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // 전송 버튼 없이 Enter로만 전송, Shift+Enter는 줄바꿈
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
        }
    };

    // 인풋에 타이핑을 시도하는 순간(focus) PRO 멤버십이 아니면 안내 모달을 띄운다
    const handleFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
        if (!isPro) {
            event.target.blur();
            setIsMembershipModalOpen(true);
        }
    };

    // 자주 묻는 질문 버튼: 서버 통신 없이 미리 정해둔 질문/답변만 화면에 표시 (멤버십/사용량과 무관하게 항상 가능)
    const handleSelectFaqTopic = (topic: FaqTopic) => {
        answerFaq(topic.question, topic.answer);
    };

    // STT로 인식이 끝나면 인풋에 채우기만 하지 않고, 인식된 텍스트로 바로 질문을 전송한다
    const handleSTTResult = (text: string) => {
        if (isLimitReached) return;
        const combined = `${input}${text}`.trim().slice(0, MAX_QUESTION_LENGTH);
        setInput("");
        if (combined && !isChatting) {
            void sendMessage(combined, lectureId);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 top-[72px] z-[100] flex w-[min(50vw,480px)] min-w-[360px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-3">
                <span className="text-sm font-semibold text-slate-800">MoAi 5</span>
                <button
                    type="button"
                    onClick={clearMessages}
                    aria-label="대화 내역 지우기"
                    className="cursor-pointer text-slate-400 transition hover:text-slate-600"
                >
                    <BrushCleaning className="h-3.5 w-3.5" />
                </button>
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

                <ChatBotFaqIntro topics={FAQ_TOPICS} onSelectTopic={handleSelectFaqTopic} />

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
                        onFocus={handleFocus}
                        maxLength={MAX_QUESTION_LENGTH}
                        placeholder={
                            isLimitReached
                                ? "오늘의 질문 횟수를 모두 사용했어요. 내일 다시 이용해주세요."
                                : isChatting
                                    ? "답변을 기다리는 중..."
                                    : "질문을 입력하고 Enter로 전송..."
                        }
                        rows={1}
                        disabled={isChatting || isLimitReached}
                        className="min-h-6 resize-none border-none bg-transparent px-0 py-0 text-[13px] text-slate-800 shadow-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                    <div
                        onClickCapture={(event) => {
                            if (!isPro) {
                                event.stopPropagation();
                                event.preventDefault();
                                setIsMembershipModalOpen(true);
                            }
                        }}
                    >
                        <STTTriggerButton onResult={handleSTTResult} disabled={isChatting || isLimitReached} />
                    </div>
                </div>

                <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                        {input.length}/{MAX_QUESTION_LENGTH}
                    </span>
                    <UsageDonutChart usage={effectiveUsage} />
                </div>
            </div>

            <MembershipRequiredModal
                open={isMembershipModalOpen}
                onOpenChange={setIsMembershipModalOpen}
                onBeforeRedirect={onClose}
            />
        </div>
    );
}
