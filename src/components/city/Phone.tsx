"use client";

import Link from "next/link";
import {
    Bell,
    BellOff,
    CalendarDays,
    CreditCard,
    MessageCircleMore,
    Users,
} from "lucide-react";
import { useState } from "react";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import message from "@/app/assets/img/phone-message.png"
import calendar from "@/app/assets/img/phone-calendar.png"
import payment from "@/app/assets/img/phone-payment.png"
import community from "@/app/assets/img/phone-community.png"
import Image from "next/image";

interface PhoneProps {
    hasNotification?: boolean;
}

export default function Phone({
    hasNotification = false,
}: PhoneProps) {
    const [notificationEnabled, setNotificationEnabled] = useState(true);

    const notificationActive =
        notificationEnabled && hasNotification;

    return (
        <div className="group absolute -bottom-[300px] right-[8%] z-30 h-[360px] w-[200px] transition-[bottom] duration-500 ease-out hover:bottom-2 focus-within:bottom-4">
            {notificationActive && (
                <>
                    <div className="pointer-events-none absolute -inset-2 rounded-[42px] bg-indigo-400/40 blur-xl animate-pulse" />
                    <div className="pointer-events-none absolute -inset-1 rounded-[40px] border-2 border-indigo-300 animate-pulse" />
                </>
            )}

            <div className="relative h-full overflow-hidden rounded-[38px] border-[9px] border-slate-950 bg-slate-950 shadow-2xl">
                <div className="absolute left-1/2 top-2 z-20 h-3 w-15 -translate-x-1/2 rounded-full bg-slate-950" />

                <div className="flex h-full flex-col overflow-hidden rounded-[28px] bg-mauve-200">
                    <header className="flex h-[76px] shrink-0 items-center justify-end border-b border-slate-200 bg-mauve-200 px-5 pt-3">
                        <HoverCard openDelay={200} closeDelay={100}>
                            <HoverCardTrigger asChild>
                                <button
                                    type="button"
                                    aria-pressed={notificationEnabled}
                                    aria-label={notificationEnabled ? "알림 끄기" : "알림 켜기"}
                                    onClick={() => setNotificationEnabled(previous => !previous)}
                                    className="relative flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-mauve-100 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                                >
                                    {notificationEnabled ? (
                                        <Bell className="h-4 w-4" />
                                    ) : (
                                        <BellOff className="h-4 w-4" />
                                    )}

                                    {notificationActive && (
                                        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
                                    )}
                                </button>
                            </HoverCardTrigger>

                            <HoverCardContent side="left" className="w-auto px-3 py-2">
                                {notificationEnabled ? "알림 끄기" : "알림 켜기"}
                            </HoverCardContent>
                        </HoverCard>
                    </header>

                    <main className="min-h-0 flex-1 px-5 py-6 justify-center items-center">
                        <div className="grid grid-cols-2 gap-5">
                            <HoverCard openDelay={200} closeDelay={100}>
                                <HoverCardTrigger asChild>
                                    <Link
                                        href="/student/phone/friends?status=chat"
                                        aria-label="메신저"
                                    // className="flex h-14 w-14 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-200 hover:shadow-md"
                                    >
                                        {/* <MessageCircleMore className="h-7 w-7" /> */}
                                        <Image src={message} alt='메신저' className="h-15 w-15 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-200 hover:shadow-md rounded-2xl" />
                                    </Link>
                                </HoverCardTrigger>

                                <HoverCardContent side="left" className="w-auto px-3 py-2">
                                    메신저
                                </HoverCardContent>
                            </HoverCard>

                            <HoverCard openDelay={200} closeDelay={100}>
                                <HoverCardTrigger asChild>
                                    <Link
                                        href="/student/phone/calendar"
                                        aria-label="캘린더"
                                    // className="flex h-14 w-14 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-200 hover:shadow-md"
                                    >
                                        {/* <CalendarDays className="h-7 w-7" /> */}
                                        <Image src={calendar} alt='캘린더' className="h-15 w-15 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-200 hover:shadow-md rounded-2xl" />
                                    </Link>
                                </HoverCardTrigger>

                                <HoverCardContent side="right" className="w-auto px-3 py-2">
                                    캘린더
                                </HoverCardContent>
                            </HoverCard>

                            <HoverCard openDelay={200} closeDelay={100}>
                                <HoverCardTrigger asChild>
                                    <Link
                                        href="/student/phone/membership"
                                        aria-label="멤버십"
                                    // className="flex h-14 w-14 items-center justify-center rounded-lg bg-amber-100 text-amber-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-200 hover:shadow-md"
                                    >
                                        {/* <CreditCard className="h-7 w-7" /> */}
                                        <Image src={payment} alt='멤버십' className="h-15 w-15 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-200 hover:shadow-md rounded-2xl" />
                                    </Link>
                                </HoverCardTrigger>

                                <HoverCardContent side="left" className="w-auto px-3 py-2">
                                    멤버십
                                </HoverCardContent>
                            </HoverCard>

                            <HoverCard openDelay={200} closeDelay={100}>
                                <HoverCardTrigger asChild>
                                    <Link
                                        href="/student/phone/community"
                                        aria-label="커뮤니티"
                                    // className="flex h-14 w-14 items-center justify-center rounded-lg bg-rose-100 text-rose-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-rose-200 hover:shadow-md"
                                    >
                                        {/* <Users className="h-7 w-7" /> */}
                                        <Image src={community} alt='커뮤니티' className="h-15 w-15 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-200 hover:shadow-md rounded-2xl" />
                                    </Link>
                                </HoverCardTrigger>

                                <HoverCardContent side="right" className="w-auto px-3 py-2">
                                    커뮤니티
                                </HoverCardContent>
                            </HoverCard>
                        </div>
                    </main>

                    <footer className="flex h-12 shrink-0 items-center justify-center border-t border-slate-200 bg-mauve-200">
                        <div className="h-1 w-24 rounded-full bg-slate-300" />
                    </footer>
                </div>
            </div>
        </div>
    );
}