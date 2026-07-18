'use client'

import Link from "next/link";
import { useEffect, useState } from "react";

interface FriendNavProps {
    status: "friend" | "request" | "chat";
    hasUnreadRequest?: boolean;
    hasUnreadChat?: boolean;
}

export default function FriendNav({
    status,
    hasUnreadRequest = false,
    hasUnreadChat = false,
}: FriendNavProps) {
    const [selected, setSelected] = useState(status);

    useEffect(() => {
        setSelected(status);
    }, [status]);

    const tabs = [
        {
            key: "friend",
            label: "내친구",
            href: "/student/friends?status=friend",
            hasUnread: false,
        },
        {
            key: "request",
            label: "요청관리",
            href: "/student/friends?status=request",
            hasUnread: hasUnreadRequest,
        },
        {
            key: "chat",
            label: "채팅",
            href: "/student/friends?status=chat",
            hasUnread: hasUnreadChat,
        },
    ] as const;

    return (
        <div className="flex items-center border-b border-slate-200 bg-white px-4 py-3">
            <div className="flex rounded-2xl bg-slate-100 p-1">
                {tabs.map(tab => (
                    <Link
                        key={tab.key}
                        href={tab.href}
                        onClick={() => setSelected(tab.key)}
                    >
                        <div
                            className={`
                                relative rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200
                                ${selected === tab.key
                                    ? "bg-white text-slate-900 shadow-md"
                                    : "text-slate-500 hover:text-slate-700"
                                }
                            `}
                        >
                            {tab.label}
                            {tab.hasUnread && (
                                <span
                                    aria-label="읽지 않은 알림 있음"
                                    className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"
                                />
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}