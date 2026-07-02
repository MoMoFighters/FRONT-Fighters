"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChatRoomListData } from "@/app/services/phone/chat/service";
import { ChatMemberResponse } from "@/features/chat/type";

const getInitial = (name?: string | null) =>
    name?.trim().charAt(0) || "?";

const getMemberDisplayName = (member?: ChatMemberResponse) =>
    member?.nickname?.trim() || member?.name?.trim() || "채팅방";

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
                            className="h-5.5 w-5.5 rounded-full"
                        />
                    ))}
                </div>
                <ProfileImage
                    member={displayMembers[2]}
                    title={title}
                    className="h-5.5 w-5.5 rounded-full"
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
    const {
        roomId,
        roomTitle,
        content,
        unreadCount,
    } = data;
    const memberInfo = data.memberInfo ?? [];
    const isGroupRoom = Boolean(roomTitle?.trim());
    const isMyRoom = myChatRoomId !== null && myChatRoomId !== undefined
        ? roomId === myChatRoomId
        : false;

    const opponent =
        memberInfo.find((member) => member.status !== "me") ??
        memberInfo[0];
    const myMember =
        memberInfo.find((member) => member.status === "me");

    const title =
        isGroupRoom
            ? roomTitle
            : isMyRoom
                ? "나와의 채팅"
                : getMemberDisplayName(opponent);

    const role = !isGroupRoom && !isMyRoom ? opponent?.role : undefined;
    const profileMember = !isGroupRoom ? (isMyRoom ? myMember : opponent) : undefined;

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
