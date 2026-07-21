"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import ChatBotTextarea from "./ChatBotTextarea";
import type { ChatUsageInfo } from "../type";
import type { Membership } from "@/features/user/type";

const FALLBACK_AUTO_QUESTION = "이 강의에 대해 설명해줘";

const DEFAULT_USAGE: ChatUsageInfo = {
    modelName: "MoAi 5 mars",
    dailyLimit: 40,
    dailyUsed: 0,
    usagePercentage: 0,
};

interface ChatBotTriggerProps {
    membership: Membership;
}

function ChatBotTrigger({ membership }: ChatBotTriggerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [usage, setUsage] = useState<ChatUsageInfo>(DEFAULT_USAGE);
    const [lectureId, setLectureId] = useState<number | undefined>(undefined);
    const [autoQuestion, setAutoQuestion] = useState<string | undefined>(undefined);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // 강의 상세 페이지의 AI 버튼(?bot=true&lectureId=&title=)으로 진입 시 자동으로 열고 질문 전송, 처리 후 쿼리 정리
    useEffect(() => {
        if (searchParams.get("bot") !== "true") return;

        const lectureIdParam = searchParams.get("lectureId");
        const titleParam = searchParams.get("title");

        setIsOpen(true);
        setLectureId(lectureIdParam ? Number(lectureIdParam) : undefined);
        setAutoQuestion(titleParam ? `${titleParam}에 대해서 설명해줘.` : FALLBACK_AUTO_QUESTION);

        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete("bot");
        nextParams.delete("lectureId");
        nextParams.delete("title");
        const query = nextParams.toString();

        router.replace(query ? `${pathname}?${query}` : pathname);
    }, [searchParams, pathname, router]);

    // 페이지 로드마다 미리 조회하지 않고, 챗봇을 실제로 열 때만 사용량을 조회한다 (불필요한 백엔드 호출 방지)
    useEffect(() => {
        if (!isOpen) return;

        let isCancelled = false;

        fetch("/api/chat/usage")
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (isCancelled || !data) return;

                setUsage((prev) => ({
                    modelName: prev.modelName,
                    dailyLimit: data.dailyLimit,
                    dailyUsed: data.callCount,
                    usagePercentage: data.usagePercentage,
                }));
            })
            .catch(() => {});

        return () => {
            isCancelled = true;
        };
    }, [isOpen]);

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label="모모 챗봇 열기"
                className="fixed bottom-8 right-8 z-[100] h-14 w-14 cursor-pointer overflow-hidden rounded-full shadow-[0_10px_24px_rgba(79,70,229,0.45)] transition hover:shadow-[0_14px_30px_rgba(79,70,229,0.55)] hover:scale-105 active:scale-95"
            >
                <Image
                    src="/images/chatbot-avatar.png"
                    alt="모모 챗봇"
                    fill
                    sizes="56px"
                    className="object-cover"
                />
            </button>

            {isOpen && (
                <ChatBotTextarea
                    onClose={() => setIsOpen(false)}
                    usage={usage}
                    membership={membership}
                    lectureId={lectureId}
                    autoQuestion={autoQuestion}
                    onAutoQuestionHandled={() => setAutoQuestion(undefined)}
                />
            )}
        </>
    );
}

interface OpenChatBotBtnProps {
    membership: Membership;
}

export default function OpenChatBotBtn({ membership }: OpenChatBotBtnProps) {
    return (
        <Suspense fallback={null}>
            <ChatBotTrigger membership={membership} />
        </Suspense>
    );
}
