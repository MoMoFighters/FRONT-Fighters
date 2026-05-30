'use client'
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import friend from '@/app/assets/img/users.svg'
import chat from '@/app/assets/img/message-circle.svg'

export default function PhoneBottomNav() {

    const pathname = usePathname();

    return (
        <div className="w-full h-10 grid grid-cols-2">
            <Link href='/student/phone/friends' className={pathname === '/student/phone/friends/chat' ? "bg-slate-100" : "bg-slate-200"}>
                <Image src={friend} alt="친구" className="w-5 h-5 mx-auto my-2"></Image>
            </Link>
            <Link href='/student/phone/friends/chat' className={pathname !== '/student/phone/friends/chat' ? "bg-slate-100" : "bg-slate-200"}>
                <Image src={chat} alt="채팅" className="w-5 h-5 mx-auto my-2"></Image>
            </Link>
        </div>
    );
}