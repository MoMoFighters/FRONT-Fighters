"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChatRoomListData } from "@/app/services/phone/chat/service";

export default function ChatRoomItem({ data }: { data: ChatRoomListData }) {
    const pathname = usePathname();
    const {
        roomId,
        roomTitle,
        memberInfo,
        content,
        unreadCount,
    } = data;

    const opponent =
        memberInfo.find(
            member => member.status !== "me"
        ) ?? memberInfo[0];

    const isMyRoom =
        memberInfo.some(
            member => member.status === "me"
        );

    const title =
        roomTitle ??
        (isMyRoom ? "나와의 채팅" : opponent?.nickname) ??
        "채팅방";

    const role = opponent?.role;
    const profileImageUrl = opponent?.profileImageUrl;

    const href =
        pathname.startsWith("/teacher")
            ? `/teacher/ask?roomId=${roomId}`
            : `/student/phone/friends?status=chat&roomId=${roomId}`;

    return (
        <Link href={href}>
            <div
                className="flex w-full cursor-pointer flex-row items-center gap-3 border-b border-slate-100 px-4 py-3 transition-colors hover:bg-slate-50"
                key={roomId}
            >
                {profileImageUrl ? (
                    <Image
                        src={profileImageUrl}
                        alt="프로필"
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full object-cover"
                    />
                ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                        <p className="font-bold">
                            {title[0] ?? "?"}
                        </p>
                    </div>
                )}

                <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-center gap-1">
                        <p className="truncate font-semibold text-slate-800">
                            {title}
                        </p>

                        {role === "TEACHER" && (
                            <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[11px] font-medium text-indigo-600">
                                강사
                            </span>
                        )}
                    </div>

                    <p className="mt-0.5 truncate text-sm text-slate-500">
                        {content}
                    </p>
                </div>

                {unreadCount > 0 && (
                    <div className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-500 px-1.5">
                        <p className="text-[11px] font-semibold text-white">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </p>
                    </div>
                )}
            </div>
        </Link>
    );
}
