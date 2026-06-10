'use client'

import Link from "next/link";
import { useEffect, useState } from "react";

interface FriendNavProps {
    status: "friend" | "request" | "chat";
}

export default function FriendNav({ status }: FriendNavProps) {
    const [selected, setSelected] = useState(status);

    useEffect(() => {
        setSelected(status);
    }, [status]);

    const tabs = [
        {
            key: "friend",
            label: "내친구",
            href: "/student/phone/friends?status=friend",
        },
        {
            key: "request",
            label: "요청관리",
            href: "/student/phone/friends?status=request",
        },
        {
            key: "chat",
            label: "채팅",
            href: "/student/phone/friends?status=chat",
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
                                rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200
                                ${selected === tab.key
                                    ? "bg-white text-slate-900 shadow-md"
                                    : "text-slate-500 hover:text-slate-700"
                                }
                            `}
                        >
                            {tab.label}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}