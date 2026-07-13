"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ChatRoomListData } from "@/app/services/phone/chat/service";
import { ChatMemberResponse } from "@/features/chat/type";
import ChatRoomOptionsMenu from "./ChatRoomOptionsMenu";

const getInitial = (name?: string | null) =>
    name?.trim().charAt(0) || "?";

const getMemberDisplayName = (member?: ChatMemberResponse) =>
    member?.nickname?.trim() || member?.name?.trim() || "채팅방";

const formatChatRoomCreatedAt = (createdAt?: string | null) => {
    if (!createdAt) {
        return "";
    }

    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const now = new Date();
    const isToday =
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const period = hours < 12 ? "오전" : "오후";
    const displayHours = hours % 12 || 12;
    const time = `${period} ${String(displayHours).padStart(2, "0")}:${minutes}`;

    if (isToday) {
        return time;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day} ${time}`;
};

function ProfileImage({
    member,
    title,
    className,
}: {
    member?: ChatMemberResponse;
    title: string;
    className: string;
}) {
    if (member?.profileImageUrl) {
        return (
            <Image
                src={member.profileImageUrl}
                alt="프로필"
                width={48}
                height={48}
                className={`${className} object-cover`}
            />
        );
    }

    return (
        <div
            className={`${className} flex items-center justify-center bg-indigo-100 text-indigo-700`}
        >
            <p className="font-bold">
                {getInitial(member?.nickname ?? title)}
            </p>
        </div>
    );
}

function GroupProfile({
    members,
    title,
}: {
    members: ChatMemberResponse[];
    title: string;
}) {
    const displayMembers = members.slice(0, 4);

    if (displayMembers.length <= 1) {
        return (
            <ProfileImage
                member={displayMembers[0]}
                title={title}
                className="h-12 w-12 rounded-full"
            />
        );
    }

    if (displayMembers.length === 2) {
        return (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center gap-0.5 overflow-hidden rounded-full bg-slate-100">
                {displayMembers.map((member) => (
                    <ProfileImage
                        key={member.userId}
                        member={member}
                        title={title}
                        className="h-6 w-6 rounded-full"
                    />
                ))}
            </div>
        );
    }

    if (displayMembers.length === 3) {
        return (
            <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center gap-0.5 overflow-hidden rounded-full bg-slate-100">
                <div className="flex gap-0.5">
                    {displayMembers.slice(0, 2).map((member) => (
                        <ProfileImage
                            key={member.userId}
                            member={member}
                            title={title}
                            className="h-5 w-5 rounded-full"
                        />
                    ))}
                </div>
                <ProfileImage
                    member={displayMembers[2]}
                    title={title}
                    className="h-5 w-5 rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="grid h-12 w-12 shrink-0 grid-cols-2 gap-0.5 overflow-hidden rounded-full bg-slate-100">
            {displayMembers.map((member) => (
                <ProfileImage
                    key={member.userId}
                    member={member}
                    title={title}
                    className="h-full w-full"
                />
            ))}
        </div>
    );
}

export default function ChatRoomItem({
    data,
    myChatRoomId,
}: {
    data: ChatRoomListData;
    myChatRoomId?: number | null;
}) {
    const pathname = usePathname();
    const { roomId, roomTitle, content, unreadCount, createdAt } = data;
    const memberInfo = data.memberInfo ?? [];
    const isGroupRoom = Boolean(roomTitle?.trim());
    const isMyRoom =
        myChatRoomId !== null && myChatRoomId !== undefined
            ? roomId === myChatRoomId
            : false;

    const opponent =
        memberInfo.find((member) => member.status !== "me") ??
        memberInfo[0];
    const myMember = memberInfo.find((member) => member.status === "me");

    const title = isGroupRoom
        ? roomTitle
        : isMyRoom
            ? "나와의 채팅"
            : getMemberDisplayName(opponent);

    const role = !isGroupRoom && !isMyRoom ? opponent?.role : undefined;
    const profileMember = !isGroupRoom
        ? isMyRoom
            ? myMember
            : opponent
        : undefined;

    const href = pathname.startsWith("/teacher")
        ? `/teacher/ask?roomId=${roomId}`
        : `/student/friends?status=chat&roomId=${roomId}`;
    const createdAtText = formatChatRoomCreatedAt(createdAt);

    return (
        <div className="flex w-full flex-row items-center gap-2 border-b border-slate-100 px-4 py-3 transition-colors hover:bg-slate-50">
            <Link
                href={href}
                className="flex min-w-0 flex-1 cursor-pointer flex-row items-center gap-3"
            >
                {isGroupRoom ? (
                    <GroupProfile
                        members={memberInfo}
                        title={title ?? "채팅방"}
                    />
                ) : (
                    <ProfileImage
                        member={profileMember}
                        title={title ?? "채팅방"}
                        className="h-12 w-12 shrink-0 rounded-full"
                    />
                )}

                <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-center gap-2">
                        <div className="flex min-w-0 flex-1 items-center gap-1">
                            <p className="truncate font-bold text-slate-800">
                                {title}
                            </p>

                            {role === "TEACHER" && (
                                <span className="shrink-0 rounded bg-indigo-50 px-1.5 py-0.5 text-[11px] font-medium text-indigo-600">
                                    강사
                                </span>
                            )}
                        </div>

                        {createdAtText && (
                            <p className="shrink-0 text-[11px] font-medium text-slate-400">
                                {createdAtText}
                            </p>
                        )}
                    </div>

                    <p className="mt-0.5 truncate text-sm text-slate-500">
                        {content}
                    </p>
                </div>
            </Link>

            {unreadCount > 0 && (
                <div className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-500 px-1.5">
                    <p className="text-[11px] font-bold text-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </p>
                </div>
            )}

            {isMyRoom ? (
                <div className="h-8 w-8 shrink-0" aria-hidden="true" />
            ) : (
                <ChatRoomOptionsMenu room={data} isMyRoom={isMyRoom} />
            )}
        </div>
    );
}
