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

    const { roomId, profile, name, recentMessage } = data

    return (
        <div className="flex flex-row align-middle p-2 bg-slate-100 gap-1">
            <div className="w-10 h-10 flex align-middle justify-center my-auto">
                <Image src={user} alt='프사' />
            </div>
            <div className="flex flex-col gap-1 w-full">
                <p className="font-bold">{name}</p>
                <p >{recentMessage}</p>
            </div>
        </div>
    );
}