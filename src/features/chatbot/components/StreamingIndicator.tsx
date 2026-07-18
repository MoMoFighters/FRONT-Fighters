import Image from "next/image";

interface StreamingIndicatorProps {
    text: string;
}

export default function StreamingIndicator({ text }: StreamingIndicatorProps) {
    return (
        <div className="flex max-w-[86%] min-w-0 items-start gap-2">
            <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full bg-indigo-500">
                <Image src="/images/chatbot-avatar.png" alt="" fill sizes="28px" className="object-cover" />
            </div>

            <div className="min-w-0">
                <p className="mb-1 text-[11px] text-slate-400">답변 생성 중...</p>
                {/* 스트리밍 중엔 말풍선이 아닌 옅은 텍스트로만 노출, 완성되면 ChatBotMessageBubble로 교체된다 */}
                <p className="whitespace-pre-wrap break-words text-[13px] leading-relaxed text-slate-400">{text}</p>
            </div>
        </div>
    );
}
