'use client'

import Image from "next/image";
import user from '@/app/assets/img/user.svg'

interface ChatRoomItemData {
    roomId: string;
    profile: string;
    name: string;
    recentMessage: string;
}

export default function ChatRoomItem({ data }: { data: ChatRoomItemData }) {

    const { roomId, profile, name, recentMessage } = data as ChatRoomItemData

    //searchParams로 온클릭 걸어서 오른쪽에 채팅방 상세 내역 띄워주기

    return (
        <div className="flex flex-row align-middle p-2 bg-slate-50 gap-1 cursor-pointer hover:bg-slate-200 border-b border-slate-300">
            <div className="w-10 h-10 flex align-middle justify-center my-auto">
                <div className="my-auto w-10 h-10 rounded-full bg-slate-100 flex justify-center align-middle px-2">
                    <Image src={user} alt='프사' />
                </div>
            </div>
            <div className="flex flex-col gap-1 w-full">
                <p className="font-bold">{name}</p>
                <p>{recentMessage}</p>
            </div>
        </div>
    );
}