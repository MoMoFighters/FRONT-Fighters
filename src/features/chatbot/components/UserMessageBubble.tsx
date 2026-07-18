import type { ChatMessage } from "../type";

interface UserMessageBubbleProps {
    message: ChatMessage;
}

export default function UserMessageBubble({ message }: UserMessageBubbleProps) {
    return (
        <div className="flex max-w-[82%] min-w-0 items-start self-end">
            <div className="min-w-0 break-words rounded-bl-xl rounded-br-xl rounded-tl-xl rounded-tr-sm bg-indigo-500 px-3.5 py-2.5 text-[13px] leading-relaxed text-white">
                {message.content}
            </div>
        </div>
    );
}
