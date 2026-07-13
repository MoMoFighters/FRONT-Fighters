'use client'

import Image from "next/image";
import Link from "next/link";
import {
    BookOpenText,
    CalendarDays,
    ChevronDown,
    LogOut,
    MessageSquare,
    MessagesSquare,
    User,
    IdCard,
    CircleDollarSign
} from "lucide-react";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import LogoutBtn from "@/components/common/LogoutBtn";

interface HeaderProfileCardProps {
    role: string;
    profileImageUrl?: string | null;
    nickname: string;
    membership?: 'BASIC' | 'PRO' | 'PLUS';
    mode: 'student' | 'teacher';
}

const membershipBadgeStyle = {
    BASIC:
        'border border-zinc-300 bg-zinc-200/50 text-zinc-700',

    PLUS:
        'border border-zinc-400 text-zinc-800 bg-[linear-gradient(135deg,#ffffff_0%,#e5e7eb_25%,#9ca3af_50%,#e5e7eb_75%,#ffffff_100%)] shadow-[inset_0_1px_1px_rgba(255,255,255,.7),0_1px_2px_rgba(0,0,0,.12)]',

    PRO:
        'border border-yellow-500 text-yellow-900 bg-[linear-gradient(135deg,#fff7cc_0%,#fcd34d_25%,#f59e0b_50%,#fcd34d_75%,#fff7cc_100%)] shadow-[inset_0_1px_1px_rgba(255,255,255,.6),0_1px_2px_rgba(0,0,0,.12)]',
};

export default function HeaderProfileCard({
    role,
    profileImageUrl,
    nickname,
    membership,
    mode
}: HeaderProfileCardProps) {
    const defaultProfile = nickname?.[0] ?? "모";
    const resolvedMembership = membership ?? "BASIC";

    const profileMenus = mode === 'student' ? [
        {
            label: "마이페이지",
            href: "/student/mypage",
            icon: IdCard,
        },
        {
            label: "친구",
            href: "/student/friends",
            icon: User,
        },
        {
            label: "커뮤니티",
            href: "/student/community",
            icon: MessagesSquare,
        },
        {
            label: "일정",
            href: "/student/calendar",
            icon: CalendarDays,
        },
        {
            label: "멤버십",
            href: "/student/mypage/membership",
            icon: CircleDollarSign,
        },
    ] : [
        {
            label: "내 강의",
            href: "/teacher/lectures",
            icon: BookOpenText,
        },
        {
            label: "커뮤니티",
            href: "/teacher/community",
            icon: MessagesSquare,
        },
        {
            label: "채팅",
            href: "/teacher/ask",
            icon: MessageSquare,
        },
    ];

    return (
        <HoverCard openDelay={80} closeDelay={120}>
            <HoverCardTrigger asChild>
                <button
                    type="button"
                    className="
                        flex items-center gap-2 rounded-full
                        border border-transparent
                        px-2 py-1
                        transition-colors
                        hover:border-slate-200
                        hover:bg-slate-50
                    "
                >
                    <div className="relative h-8 w-8 overflow-hidden rounded-full bg-indigo-100">
                        {profileImageUrl ? (
                            <Image
                                src={profileImageUrl}
                                alt="프로필 이미지"
                                fill
                                sizes="32px"
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-indigo-500">
                                {defaultProfile}
                            </div>
                        )}
                    </div>

                    <span className="max-w-24 truncate text-sm font-bold text-slate-800">
                        {nickname}
                    </span>

                    <ChevronDown className="h-4 w-4 text-slate-500" />
                </button>
            </HoverCardTrigger>

            <HoverCardContent
                align="end"
                sideOffset={10}
                className="w-72 rounded-2xl border border-slate-200 bg-white p-0 shadow-xl"
            >
                <div className="flex items-center gap-3 px-5 py-4">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full bg-indigo-100">
                        {profileImageUrl ? (
                            <Image
                                src={profileImageUrl}
                                alt="프로필 이미지"
                                fill
                                sizes="48px"
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-lg font-bold text-indigo-500">
                                {defaultProfile}
                            </div>
                        )}
                    </div>

                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-bold text-slate-900">
                                {nickname}
                            </p>

                            {role === "student" && <span
                                className={`
                                    rounded-full px-2 py-0.5
                                    text-[11px] font-bold
                                    ${membershipBadgeStyle[resolvedMembership]}
                                `}
                            >
                                {resolvedMembership}
                            </span>}
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-100 py-2">

                    {profileMenus.map(({ label, href, icon: Icon }) => (
                        <Link
                            key={label}
                            href={href}
                            className="
                                flex items-center gap-3
                                px-5 py-2.5
                                text-sm font-medium text-slate-700
                                transition-colors
                                hover:bg-slate-50
                                hover:text-slate-950
                            "
                        >
                            <Icon className="h-4 w-4 text-slate-500" />
                            {label}
                        </Link>
                    ))}
                </div>

                <div className="border-t border-slate-100 px-2 py-2">
                    <div
                        className="
                            flex items-center gap-3 rounded-lg
                            px-3 py-1.5
                            text-sm font-medium text-slate-700
                            hover:bg-slate-50
                        "
                    >
                        <LogOut className="h-4 w-4 text-slate-500" />
                        <LogoutBtn />
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}