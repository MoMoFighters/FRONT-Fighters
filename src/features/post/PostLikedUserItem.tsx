"use client";

import Link from "next/link";
import { UserRound } from "lucide-react";

import type { CommunityPostLikedUser } from "@/features/community/type";

interface PostLikedUserItemProps {
    user: CommunityPostLikedUser;
}

export default function PostLikedUserItem({
    user,
}: PostLikedUserItemProps) {
    return (
        <Link
            href={`/student/community/user/${user.userId}`}
            className="flex items-center gap-3 rounded-2xl px-3 py-2.5 transition hover:bg-rose-50/70"
        >
            <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-rose-100 to-indigo-100 text-sm font-black text-rose-500">
                {user.profileImageUrl ? (
                    <img
                        src={user.profileImageUrl}
                        alt={`${user.userName} profile`}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <UserRound className="h-5 w-5" />
                )}
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black text-slate-800">
                    {user.userName}
                </p>
                <p className="mt-0.5 text-xs font-bold text-slate-400">
                    {user.role === "TEACHER" ? "강사" : "학생"}
                </p>
            </div>
        </Link>
    );
}
