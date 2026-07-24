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
import MembershipBadge from "@/components/common/MembershipBadge";

export interface HeaderProfileCardProps {
    role: string;
    profileImageUrl?: string | null;
    nickname: string;
    membership?: 'BASIC' | 'PLUS' | 'PRO';
    membershipUntil?: string | null;
    mode: 'student' | 'teacher';
}

export default function HeaderProfileCard({
    role,
    profileImageUrl,
    nickname,
    membership,
    membershipUntil,
    mode,
    onLogoutClick,
}: HeaderProfileCardProps & { onLogoutClick: () => void }) {
    const defaultProfile = nickname?.[0] ?? "모";

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
                        flex items-center gap-1 rounded-full
                        border border-transparent
                        px-1 py-1
                        transition-colors
                        hover:border-slate-200
                        hover:bg-slate-50
                        sm:gap-2 sm:px-2
                    "
                >
                    <div className="relative h-6 w-6 overflow-hidden rounded-full bg-indigo-100 sm:h-8 sm:w-8">
                        {profileImageUrl ? (
                            <Image
                                src={profileImageUrl}
                                alt="프로필 이미지"
                                fill
                                sizes="(min-width: 640px) 32px, 24px"
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-indigo-500 sm:text-sm">
                                {defaultProfile}
                            </div>
                        )}
                    </div>

                    <span className="hidden max-w-24 truncate text-sm font-bold text-slate-800 sm:inline">
                        {nickname}
                    </span>

                    <ChevronDown className="h-3 w-3 text-slate-500 sm:h-4 sm:w-4" />
                </button>
            </HoverCardTrigger>

            <HoverCardContent
                align="end"
                sideOffset={10}
                className="w-[260px] rounded-2xl border border-slate-200 bg-white p-0 shadow-xl"
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

                            {role === "student" && (
                                <MembershipBadge
                                    membership={membership}
                                    membershipUntil={membershipUntil}
                                />
                            )}
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
                    <button
                        type="button"
                        onClick={onLogoutClick}
                        className="
                            flex w-full items-center gap-3 rounded-lg
                            px-3 py-1.5
                            text-sm font-medium text-slate-700
                            hover:bg-slate-50
                        "
                    >
                        <LogOut className="h-4 w-4 text-slate-500" />
                        로그아웃
                    </button>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}