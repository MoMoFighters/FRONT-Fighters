"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import type { FaqTopic } from "../faqData";

const INTRO_MARKDOWN = `### 안녕하세요! 모모시티 고객지원 챗봇 모아이입니다!

모모시티에 대해서 궁금하신 게 있으신가요?`;

interface ChatBotFaqIntroProps {
    topics: FaqTopic[];
    onSelectTopic: (topic: FaqTopic) => void;
}

export default function ChatBotFaqIntro({ topics, onSelectTopic }: ChatBotFaqIntroProps) {
    return (
        <div className="flex max-w-[86%] min-w-0 items-start gap-2">
            <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full bg-indigo-500">
                <Image src="/images/chatbot-avatar.png" alt="" fill sizes="28px" className="object-cover" />
            </div>

            <div className="min-w-0 rounded-bl-xl rounded-br-xl rounded-tl-sm rounded-tr-xl border border-slate-200 bg-white px-3.5 py-2.5 text-center text-[13px] leading-relaxed text-slate-700 shadow-sm">
                <div className="prose prose-sm min-w-0 max-w-none prose-headings:my-1 prose-headings:text-sm prose-p:my-1">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{INTRO_MARKDOWN}</ReactMarkdown>
                </div>

                <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                    {topics.map((topic) => (
                        <button
                            key={topic.id}
                            type="button"
                            onClick={() => onSelectTopic(topic)}
                            className="cursor-pointer rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[12px] font-medium text-indigo-600 transition hover:bg-indigo-100"
                        >
                            {topic.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
