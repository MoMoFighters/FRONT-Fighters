"use client";

import { MessageCircle, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PhoneBottomNav() {
    const pathname = usePathname();

    return (
        <div className="grid h-10 w-full grid-cols-2">
            <Link
                href="/student/friends"
                className={pathname === "/student/friends/chat" ? "bg-slate-100" : "bg-slate-200"}
                aria-label="친구"
            >
                <Users className="mx-auto my-2 h-5 w-5 text-slate-700" />
            </Link>
            <Link
                href="/student/friends/chat"
                className={pathname !== "/student/friends/chat" ? "bg-slate-100" : "bg-slate-200"}
                aria-label="채팅"
            >
                <MessageCircle className="mx-auto my-2 h-5 w-5 text-slate-700" />
            </Link>
        </div>
    );
}
