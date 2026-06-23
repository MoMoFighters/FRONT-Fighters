"use client"

import ChatReportBtn from "@/features/chat/ChatReportBtn";
import { useState } from "react";

interface MessageData {
    id: number;
    isMine: boolean | null;
    message: string;
    time: string;
}

export default function ChatItem({
    isMine,
    message,
    time,
    id,
}: MessageData) {

    const [isHover, setIsHover] = useState(false);

    if (isMine === null) {
        return (
            <div className="justify-center w-full h-3">
                <div className="max-w-fit min-w-10 rounded-md bg-indigo-500/50 py-1 px-2">
                    <p className="text-center text-sm text-slate-100">
                        {message}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div
            className={`w-full flex gap-2 ${isMine === true ? "justify-end" : "justify-start"
                }`}
            key={id}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            {isMine === false ? (
                <>
                    <div
                        className="
                    max-w-[300px]
                    w-fit
                    bg-white
                    px-4
                    py-2
                    rounded-[20px]
                    rounded-bl-md
                    shadow-sm
                "
                    >
                        <p className="text-slate-800 break-words whitespace-pre-wrap">
                            {message}
                        </p>
                    </div>

                    <p className="mt-auto text-xs text-slate-400 shrink-0">
                        {time}
                    </p>
                    {isHover ? (
                        <ChatReportBtn />
                    ) : ""}
                </>
            ) : (
                <>
                    <p className="mt-auto text-xs text-slate-400 shrink-0">
                        {time}
                    </p>

                    <div
                        className="
                    max-w-[300px]
                    w-fit
                    bg-indigo-500
                    px-4
                    py-2
                    rounded-[20px]
                    rounded-br-md
                    shadow-sm
                "
                    >
                        <p className="text-white break-words whitespace-pre-wrap">
                            {message}
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}