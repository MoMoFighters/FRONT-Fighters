'use client'

import Image from "next/image";
import user from '@/app/assets/img/user.svg'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChatRoomListData } from "@/features/phone/chatType";



export default function ChatRoomItem({ data }: { data: ChatRoomListData }) {

    const pathname = usePathname();
    const { roomId, nickname, content, role, lectureTitle, userId, unreadCount } = data as ChatRoomListData

    const href =
        pathname.startsWith('/teacher')
            ? `/teacher/ask?roomId=${roomId}`
            : `/student/phone/friends?status=friend&roomId=${roomId}`;


    //searchParams로 온클릭 걸어서 오른쪽에 채팅방 상세 내역 띄워주기

    return (
        <Link href={href}>
            <div
                className="px-4 py-3 flex flex-row gap-3 w-full hover:bg-slate-50 transition-colors cursor-pointer items-center border-b border-slate-100"
                key={data.roomId}
            >
                {data.profileImageUrl ? (
                    <Image
                        src={data.profileImageUrl || ""}
                        alt="프사"
                        width={48}
                        height={48}
                        className="rounded-full object-cover w-12 h-12"
                    />
                ) : (
                    <div className="rounded-full bg-indigo-100 text-indigo-700 flex justify-center items-center w-12 h-12 shrink-0">
                        <p className="font-bold">
                            {nickname[0]}
                        </p>
                    </div>
                )}

                <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                        <p className="font-semibold text-slate-800 truncate">
                            {nickname}
                        </p>

                        {role === "TEACHER" && (
                            <span className="text-[11px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 font-medium">
                                강사
                            </span>
                        )}
                    </div>

                    <p className="text-sm text-slate-500 truncate mt-0.5">
                        {content}
                    </p>
                </div>

                {unreadCount > 0 && (
                    <div className="min-w-5 h-5 px-1.5 rounded-full bg-indigo-500 flex items-center justify-center">
                        <p className="text-[11px] font-semibold text-white">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </p>
                    </div>
                )}
            </div>
        </Link>
    );
}