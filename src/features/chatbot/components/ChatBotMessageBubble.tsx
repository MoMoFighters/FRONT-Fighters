"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import Image from "next/image";
import TTSTriggerButton from "./TTSTriggerButton";
import type { ChatMessage } from "../type";

interface ChatBotMessageBubbleProps {
    message: ChatMessage;
}

export default function ChatBotMessageBubble({ message }: ChatBotMessageBubbleProps) {
    return (
        <div className="group flex max-w-[86%] min-w-0 items-start gap-2">
            <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full bg-indigo-500">
                <Image src="/images/chatbot-avatar.png" alt="" fill sizes="28px" className="object-cover" />
            </div>

            <div className="flex min-w-0 flex-col gap-1">
                <div className="min-w-0 rounded-bl-xl rounded-br-xl rounded-tl-sm rounded-tr-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] leading-relaxed text-slate-700 shadow-sm">
                    <div className="prose prose-sm min-w-0 max-w-none prose-p:my-1 prose-pre:my-2">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw, rehypeSanitize]}
                            components={{
                                code({ className, children, ...props }: any) {
                                    const matched = /language-(\w+)/.exec(className || "");
                                    if (matched) {
                                        return (
                                            <SyntaxHighlighter
                                                language={matched[1]}
                                                PreTag="div"
                                                style={oneLight}
                                                customStyle={{
                                                    borderRadius: 8,
                                                    fontSize: 12,
                                                    border: "1px solid #e2e8f0",
                                                    maxWidth: "100%",
                                                    overflowX: "auto",
                                                }}
                                                {...props}
                                            >
                                                {String(children).replace(/\n$/, "")}
                                            </SyntaxHighlighter>
                                        );
                                    }
                                    return (
                                        <code className="rounded bg-slate-100 px-1 py-0.5 text-[12px] break-words text-slate-700" {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    </div>
                </div>

                <div className="flex justify-end opacity-0 transition-opacity group-hover:opacity-100">
                    <TTSTriggerButton text={message.content} />
                </div>
            </div>
        </div>
    );
}
