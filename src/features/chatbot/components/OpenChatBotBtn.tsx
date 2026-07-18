"use client";

import { useState } from "react";
import Image from "next/image";
import ChatBotTextarea from "./ChatBotTextarea";

// PRO 멤버십 예외처리는 getMyInfo() 결과를 받아 별도로 붙일 예정 (현재는 UI 확인용으로 조건 없이 렌더링)
export default function OpenChatBotBtn() {
    const [isOpen, setIsOpen] = useState(false);

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

            {isOpen && <ChatBotTextarea onClose={() => setIsOpen(false)} />}
        </>
    );
}
