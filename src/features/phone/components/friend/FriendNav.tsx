'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { MessageCircle, UserPlus, Users } from "lucide-react";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

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
            Icon: Users,
        },
        {
            key: "request",
            label: "요청관리",
            href: "/student/friends?status=request",
            hasUnread: hasUnreadRequest,
            Icon: UserPlus,
        },
        {
            key: "chat",
            label: "채팅",
            href: "/student/friends?status=chat",
            hasUnread: hasUnreadChat,
            Icon: MessageCircle,
        },
    ] as const;

    return (
        <div className="flex h-full shrink-0 flex-col border-r border-slate-200 bg-white pr-3 py-3">
            <div className="flex flex-col gap-1 rounded-2xl bg-slate-100 p-1">
                {tabs.map(tab => (
                    <HoverCard key={tab.key} openDelay={150} closeDelay={0}>
                        <HoverCardTrigger asChild>
                            <Link
                                href={tab.href}
                                aria-label={tab.label}
                                onClick={() => setSelected(tab.key)}
                            >
                                <div
                                    className={`
                                        relative flex items-center justify-center rounded-xl h-14 w-14 text-sm font-medium transition-all duration-200
                                        ${selected === tab.key
                                            ? "bg-white text-slate-900 shadow-md"
                                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-200"
                                        }
                                    `}
                                >
                                    <tab.Icon className="h-6 w-6" aria-hidden="true" />
                                    {tab.hasUnread && (
                                        <span
                                            aria-label="읽지 않은 알림 있음"
                                            className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"
                                        />
                                    )}
                                </div>
                            </Link>
                        </HoverCardTrigger>
                        <HoverCardContent
                            side="right"
                            align="center"
                            className="w-auto px-3 py-1.5 text-sm font-medium"
                        >
                            {tab.label}
                        </HoverCardContent>
                    </HoverCard>
                ))}
            </div>
        </div>
    );
}
