"use client";

import { useState } from "react";
import Image from "next/image";
import ChatReportModal from "@/features/chat/ChatReportModal";
import { TriangleAlertIcon } from "lucide-react";

interface MessageData {
    id: number;
    isMine: boolean | null;
    message: string;
    time: string;
    nickname?: string;
    profileImg?: string;
}

export default function ChatItem({
    isMine,
    message,
    time,
    id,
    nickname,
    profileImg
}: MessageData) {
    const [isHover, setIsHover] = useState(false);
    const [isModal, setIsModal] = useState(false);

    if (isMine === null) {
        return (
            <div className="flex h-8 w-full justify-center select-none">
                <div className="min-w-10 max-w-fit rounded-full bg-slate-200/70 px-4 py-1">
                    <p className="text-center text-sm text-slate-900">
                        {message}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`flex w-full gap-2 ${isMine ? "justify-end" : "justify-start items-start"}`}
            key={id}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            {!isMine ? (
                <>
                    <div className="mt-5 h-9 w-9 shrink-0 overflow-hidden rounded-full bg-indigo-50">
                        {profileImg ? (
                            <Image
                                src={profileImg}
                                alt=""
                                width={36}
                                height={36}
                                className="h-full w-full object-cover"
                                unoptimized
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-indigo-500">
                                {nickname?.slice(0, 1) ?? "?"}
                            </div>
                        )}
                    </div>

                    <div className="flex min-w-0 max-w-[300px] flex-col gap-1">
                        <p className="truncate text-xs font-semibold text-slate-500">
                            {nickname}
                        </p>
                        <div className="w-fit max-w-full rounded-[20px] rounded-bl-md bg-white px-4 py-2 shadow-sm">
                            <p className="whitespace-pre-wrap break-words text-slate-800">
                                {message}
                            </p>
                        </div>
                    </div>

                    <p className="mt-auto shrink-0 text-xs text-slate-400">
                        {time}
                    </p>

                    {isHover && (
                        <button
                            type="button"
                            className="p-0.5 rounded-sm select-none mt-auto text-xs font-semibold text-rose-400 transition-colors hover:text-rose-500 cursor-pointer"
                            onClick={() => {
                                setIsModal(true);
                                setIsHover(false);
                            }}
                        >
                            <TriangleAlertIcon className="w-3 h-3" />
                        </button>
                    )}

                    {isModal && (
                        <ChatReportModal
                            id={id}
                            message={message}
                            setIsModal={setIsModal}
                        />
                    )}
                </>
            ) : (
                <>
                    <p className="mt-auto shrink-0 text-xs text-slate-400">
                        {time}
                    </p>

                    <div className="w-fit max-w-[300px] rounded-[20px] rounded-br-md bg-indigo-500 px-4 py-2 shadow-sm">
                        <p className="whitespace-pre-wrap break-words text-white">
                            {message}
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}
