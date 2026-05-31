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
                className="p-5 flex flex-row gap-3 w-80 bg-slate-50 hover:bg-slate-100 cursor-pointer items-center"
                key={data.roomId}
            >
                {data.profileImageUrl ? (
                    <Image
                        src={data.profileImageUrl || ""}
                        alt='프사' width={40} height={40}
                        className="rounded-full bg-pink-100 flex justify-center my-auto" />
                ) : (
                    <div className="rounded-full bg-pink-100 flex justify-center my-auto w-10 h-10">
                        <p className="my-auto font-bold">{nickname[0]}</p>
                    </div>
                )}

                <div className="flex flex-col gap-1 flex-1">
                    <div className="flex flex-row gap-1 items-end">
                        <p className="font-bold text-md text-slate-800">{nickname}</p>
                        <p className="text-sm text-slate-900 mb-0.5">
                            {`${role === 'TEACHER' ? "(강사)" : ""}`}
                        </p>
                    </div>

                    <p className="text-sm text-slate-400">{content}</p>
                </div>
                {unreadCount !== 0 ? (
                    <div className="bg-pink-400 w-6 h-6 rounded-full items-center text-center flex justify-center">
                        <p className="text-slate-50 text-[12px] font-bold">{unreadCount}</p>
                    </div>
                ) : ""}
            </div>
        </Link>
        // 데이터 형식 맞춰서 아래꺼로 나중에 바꾸기
        /*<div className="p-5 flex flex-row gap-3 w-80" key={friend.id}>
                                <div className="rounded-full bg-pink-100 w-10 h-10 flex justify-center my-auto">
                                    <p className="my-auto font-bold">{friend.profile}</p>
                                </div>
                                <div className="flex flex-col gap-1 flex-1 align-middle">
                                    <p className="font-bold text-md text-slate-900">{friend.name}</p>
                                    <p className="text-sm text-slate-400">{friend.recentMessage}</p>
                                </div>
                                <div>
                                    ...
                                </div>
                            </div>*/
    );
}