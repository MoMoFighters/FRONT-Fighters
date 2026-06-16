"use client";

import Link from "next/link";
import { Bell, BellOff } from "lucide-react";
import { useState } from "react";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import Image from "next/image";

import message from "@/app/assets/img/phone-message.png";
import calendar from "@/app/assets/img/phone-calendar.png";
import payment from "@/app/assets/img/phone-payment.png";
import community from "@/app/assets/img/phone-community.png";
import phoneBg from "@/app/assets/img/phone-bg.png";

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
        <div className="group absolute -bottom-[400px] right-[8%] z-30 h-[440px] w-[230px] transition-[bottom] duration-500 ease-out hover:bottom-2 focus-within:bottom-4">
            {notificationActive && (
                <>
                    <div className="pointer-events-none absolute -inset-2 rounded-[42px] bg-indigo-400/40 blur-xl animate-pulse" />
                    <div className="pointer-events-none absolute -inset-1 rounded-[40px] border-2 border-indigo-300 animate-pulse" />
                </>
            )}

            <div className="relative h-full overflow-hidden rounded-[30px] border-[8px] border-slate-950 bg-slate-950 shadow-2xl">
                <div className="absolute left-1/2 top-2 z-30 h-3 w-15 -translate-x-1/2 rounded-full bg-slate-950" />

                <div className="relative flex h-full flex-col overflow-hidden rounded-[28px] bg-mauve-200">
                    <Image
                        src={phoneBg}
                        alt=""
                        fill
                        priority
                        sizes="230px"
                        className="object-cover"
                    />

                    <div className="absolute inset-0 bg-white/10" />

                    <header className="relative z-10 flex h-[76px] shrink-0 items-center justify-end px-5 pt-3">
                        <HoverCard openDelay={200} closeDelay={100}>
                            <HoverCardTrigger asChild>
                                <button
                                    type="button"
                                    aria-pressed={notificationEnabled}
                                    aria-label={notificationEnabled ? "알림 끄기" : "알림 켜기"}
                                    onClick={() => setNotificationEnabled(previous => !previous)}
                                    className="relative flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/0 bg-white/0 text-slate-50 shadow-sm backdrop-blur-md transition-colors hover:bg-white hover:text-slate-900"
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

                    <main className="flex justify-center items-center z-10 min-h-0 flex-1 px-4 mt-[-2]">
                        <div className="grid grid-cols-2 gap-8">
                            <HoverCard openDelay={200} closeDelay={100}>
                                <HoverCardTrigger asChild>
                                    <Link
                                        href="/student/phone/friends?status=chat"
                                        aria-label="메신저"
                                    >
                                        <Image
                                            src={message}
                                            alt="메신저"
                                            className="h-16 w-16 rounded-2xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                                        />
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
                                    >
                                        <Image
                                            src={calendar}
                                            alt="캘린더"
                                            className="h-16 w-16 rounded-2xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                                        />
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
                                    >
                                        <Image
                                            src={payment}
                                            alt="멤버십"
                                            className="h-16 w-16 rounded-2xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                                        />
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
                                    >
                                        <Image
                                            src={community}
                                            alt="커뮤니티"
                                            className="h-16 w-16 rounded-2xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                                        />
                                    </Link>
                                </HoverCardTrigger>

                                <HoverCardContent side="right" className="w-auto px-3 py-2">
                                    커뮤니티
                                </HoverCardContent>
                            </HoverCard>
                        </div>
                    </main>

                    <footer className="relative z-10 flex h-12 shrink-0 items-center justify-center">
                        <div className="h-1.5 w-24 rounded-full bg-slate-700/85 shadow-[0_1px_8px_rgba(255,255,255,0.45)]" />
                    </footer>
                </div>
            </div>
        </div>
    );
}