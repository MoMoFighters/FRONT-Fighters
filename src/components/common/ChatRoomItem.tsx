'use client'

import Image from "next/image";
import user from '@/app/assets/img/user.svg'
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ChatRoomInfo {
    userId: number;
    nickname: string;
    lectureTitle?: string;
    role: 'STUDENT' | 'TEACHER';
    roomId: number;
    content?: string | null;
    unreadCount: number;
}

export default function ChatRoomItem({ data }: { data: ChatRoomInfo }) {

    const pathname = usePathname();
    const { roomId, nickname, content, role, lectureTitle, userId, } = data as ChatRoomInfo

    const href =
        pathname.startsWith('/teacher')
            ? `/teacher/ask?roomId=${roomId}`
            : `/student/phone/friends?status=friend&roomId=${roomId}`;


    //searchParams로 온클릭 걸어서 오른쪽에 채팅방 상세 내역 띄워주기

    return (
        <Link href={href}>
            <div
                className="p-5 flex flex-row gap-3 w-80 bg-slate-50 hover:bg-slate-100 cursor-pointer"
                key={data.roomId}
            >
                <div className="rounded-full bg-pink-100 w-10 h-10 flex justify-center my-auto">
                    <p className="my-auto font-bold">{nickname[0]}</p>
                </div>
                <div className="flex flex-col gap-1 flex-1">
                    <div className="flex flex-row gap-1 items-end">
                        <p className="font-bold text-md text-slate-800">{nickname}</p>
                        <p className="text-sm text-slate-900 mb-0.5">
                            {`${role === 'TEACHER' ? "(강사)" : ""}`}
                        </p>
                    </div>

                    <p className="text-sm text-slate-400">{content}</p>
                </div>
                <div>
                    ...
                    {/* 나중에 홍근님 드롭다운 모달 연결하기 */}
                </div>
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