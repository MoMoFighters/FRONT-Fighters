'use client'

import { CalendarCheck, CreditCard, Menu, MessageCircleMore, Users, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CreateReportBtn from "@/features/report/components/buttons/CreateReportBtn";

export default function OnSidebarBtn() {

    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="
                    fixed left-6 top-20 z-40
                    h-8 w-20
                    rounded-lg
                    border border-slate-300
                     bg-slate-100
                    shadow-lg
                    backdrop-blur
                    flex items-center justify-center
                     hover:bg-white
                    transition
                    cursor-pointer
                    text-slate-800
                    text-sm
                    font-semibold
                "
            >
                <Menu className="h-4 w-4 mr-2" />메뉴
            </button>
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="
            fixed inset-x-0 bottom-0 top-0 z-40
            bg-slate-950/20
            backdrop-blur-[1px]
          "
                />
            )}
            <aside
                className={`
          fixed left-0 top-0 bottom-0 z-50
          w-48
          border-r border-slate-200
          bg-white/95
          backdrop-blur-xl
          shadow-xl
          transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
            >
                <div className="flex h-12 items-center justify-between border-b border-slate-100 px-3   ">
                    <Menu className="h-4 w-4 mr-2" />

                    <button
                        onClick={() => setOpen(false)}
                        className="
              h-9 w-9
              rounded-full
              hover:bg-slate-100
              flex items-center justify-center
              transition
            "
                    >
                        <X className="h-5 w-5 text-slate-700" />
                    </button>
                </div>

                <nav className="p-3">
                    <Link href="/student/community">
                        <Button variant="ghost" className='flex w-43 gap-2 justify-start mb-2 py-3'>
                            <Users />
                            <p className='text-[14px] text-slate-900'>커뮤니티</p>
                        </Button>
                    </Link>
                    <Link href="/student/phone/friends">
                        <Button variant="ghost" className='flex w-43 gap-2 justify-start mb-2 py-3'>
                            <MessageCircleMore />
                            <p className='text-[14px] text-slate-900'>채팅</p>
                        </Button>
                    </Link>
                    <Link href="/student/phone/calendar">
                        <Button variant="ghost" className='flex w-43 gap-2 justify-start mb-2 py-3'>
                            <CalendarCheck />
                            <p className='text-[14px] text-slate-900'>일정</p>
                        </Button>
                    </Link>
                    <Link href="/student/payments">
                        <Button variant="ghost" className='flex w-43 gap-2 justify-start mb-2 py-3'>
                            <CreditCard />
                            <p className='text-[14px] text-slate-900'>멤버십</p>
                        </Button>
                    </Link>
                    <CreateReportBtn />
                </nav>
            </aside>
        </>
    );
}