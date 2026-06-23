"use client";

import Link from "next/link";
import { Bell, BellOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import Image from "next/image";

import logo from '@/app/assets/img/logo.png'
import message from "@/app/assets/img/phone-message.png";
import calendar from "@/app/assets/img/phone-calendar.png";
import tutorial from "@/app/assets/img/phone-tutorial.png";
import community from "@/app/assets/img/phone-community.png";

interface PhoneProps {
    hasNotification?: boolean;
    responsive?: boolean;
}

export default function Phone({
    hasNotification = false,
    responsive = false,
}: PhoneProps) {

    // donotdisturb 정보 fetch 받아서 연결
    const [notificationEnabled, setNotificationEnabled] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [isInteractionLocked, setIsInteractionLocked] = useState(false);
    const [vibrationOffset, setVibrationOffset] = useState({
        x: 0,
        y: 0,
    });
    const hoverReleaseTimerRef = useRef<number | null>(null);
    const interactionLockTimerRef = useRef<number | null>(null);

    // notification 개수를 받아와서 각각 상태관리
    const [notification, setNotification] = useState({
        totalMsgFriendCount: 11, //메시지, 친구 관련 총 알림 개수
        calendaerCount: 44, // 캘린더 알림 총 개수
        communityCount: 101 // 커뮤니티 알림 총 개수
    });

    const notificationActive = notificationEnabled && hasNotification;
    const hasNotificationValue =
        Object.values(notification).some(count => count > 0);
    const shouldVibrate =
        !isHovered &&
        !isInteractionLocked &&
        notificationEnabled &&
        hasNotificationValue;

    const clearHoverReleaseTimer = () => {
        if (hoverReleaseTimerRef.current === null) {
            return;
        }

        window.clearTimeout(hoverReleaseTimerRef.current);
        hoverReleaseTimerRef.current = null;
    };

    const keepPhoneStable = () => {
        clearHoverReleaseTimer();
        setIsHovered(true);
    };

    const releasePhoneStable = () => {
        clearHoverReleaseTimer();
        hoverReleaseTimerRef.current = window.setTimeout(() => {
            setIsHovered(false);
        }, 450);
    };

    const lockInteraction = () => {
        if (interactionLockTimerRef.current !== null) {
            window.clearTimeout(interactionLockTimerRef.current);
        }

        setIsInteractionLocked(true);
        interactionLockTimerRef.current = window.setTimeout(() => {
            setIsInteractionLocked(false);
        }, 700);
    };

    useEffect(() => {
        if (!shouldVibrate) {
            setVibrationOffset({
                x: 0,
                y: 0,
            });
            return;
        }

        const vibrationPositions = [
            { x: -3, y: 0 },
            { x: 3, y: 0 },
            { x: 0, y: -3 },
            { x: 0, y: 3 },
            { x: 0, y: 0 },
        ];

        const intervalId = window.setInterval(() => {
            const randomPosition =
                vibrationPositions[
                Math.floor(Math.random() * vibrationPositions.length)
                ];

            setVibrationOffset(randomPosition);
        }, 80);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [shouldVibrate]);

    useEffect(() => {
        return () => {
            if (hoverReleaseTimerRef.current !== null) {
                window.clearTimeout(hoverReleaseTimerRef.current);
            }

            if (interactionLockTimerRef.current !== null) {
                window.clearTimeout(interactionLockTimerRef.current);
            }
        };
    }, []);

    return (
        <div className={responsive
            ? "group absolute -bottom-[26.875cqw] right-[8%] z-30 aspect-[23/44] w-[18cqw] [container-type:inline-size] transition-[bottom] duration-500 ease-out hover:bottom-[0.2cqw] focus-within:bottom-[0.3cqw]"
            : "group absolute -bottom-[400px] right-[8%] z-30 h-[440px] w-[230px] transition-[bottom] duration-500 ease-out hover:bottom-2 focus-within:bottom-4"}
            onMouseEnter={keepPhoneStable}
            onMouseLeave={releasePhoneStable}
            onFocusCapture={keepPhoneStable}
            onBlurCapture={releasePhoneStable}
            style={{
                transform: `translate(${vibrationOffset.x}px, ${vibrationOffset.y}px)`,
            }}
        >
            <div className={responsive
                ? "absolute bottom-0 right-0 h-[440px] w-[230px] origin-bottom-right [transform:scale(calc(100cqw/230px))]"
                : "h-full w-full"}
            >
                {notificationActive && (
                    <>
                        <div className="pointer-events-none absolute -inset-2 rounded-[42px] bg-indigo-400/40 blur-xl animate-pulse" />
                        <div className="pointer-events-none absolute -inset-1 rounded-[40px] border-2 border-indigo-300 animate-pulse" />
                    </>
                )}

                <div className="relative h-full overflow-hidden rounded-[30px] border-[8px] border-slate-950 bg-slate-950 shadow-2xl">
                    <div className="absolute left-1/2 top-2 z-30 h-3 w-15 -translate-x-1/2 rounded-full bg-slate-950" />

                    <div className="relative flex h-full flex-col overflow-hidden rounded-[28px] bg-white">
                        <div className="absolute inset-0 bg-white" />

                        <header className="relative z-10 flex h-[76px] shrink-0 items-center justify-end px-5 pt-3">
                            <HoverCard openDelay={100} closeDelay={100} >
                                <HoverCardTrigger asChild>
                                    <button
                                        type="button"
                                        aria-pressed={notificationEnabled}
                                        aria-label={notificationEnabled ? "알림 끄기" : "알림 켜기"}
                                        onClick={() => {
                                            keepPhoneStable();
                                            lockInteraction();
                                            setNotificationEnabled(previous => !previous);
                                        }}
                                        className="relative flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/0 bg-white/0 text-slate-50 shadow-sm backdrop-blur-md transition-colors hover:bg-white hover:text-slate-900"
                                    >
                                        {notificationEnabled ? (
                                            <Bell className="h-4 w-4 text-slate-500 hover:text-slate-700" />
                                        ) : (
                                            <BellOff className="h-4 w-4 text-slate-500 hover:text-slate-700" />
                                        )}

                                        {notificationActive && (
                                            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
                                        )}
                                    </button>
                                </HoverCardTrigger>

                                <HoverCardContent
                                    side="left"
                                    className="w-auto px-3 py-2"
                                    onMouseEnter={keepPhoneStable}
                                    onMouseLeave={releasePhoneStable}
                                >
                                    {notificationEnabled ? "알림 끄기" : "알림 켜기"}
                                </HoverCardContent>
                            </HoverCard>
                        </header>

                        <main className="flex flex-col justify-center items-center gap-10 z-10 min-h-0 flex-1 px-4">
                            <div className="relative w-30 h-5">
                                <Image
                                    src={logo}
                                    alt="MOMOCITY 로고"
                                    fill
                                    priority
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <HoverCard openDelay={200} closeDelay={100}>
                                    <HoverCardTrigger asChild>
                                        <Link
                                            href="/student/phone/friends?status=chat"
                                            aria-label="메신저"
                                            className="h-14 w-14 rounded-2xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md relative"
                                        >
                                            <>
                                                <Image
                                                    src={message}
                                                    alt="메신저"
                                                    fill
                                                />
                                                <div className="ml-auto w-4 h-4 text-xs relative text-center items-center z-5 rounded-full bg-red-500 text-white">
                                                    {notification.totalMsgFriendCount > 99 ? "99+" : notification.totalMsgFriendCount}
                                                </div>
                                            </>
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
                                            className="h-14 w-14 rounded-2xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md relative"
                                        >
                                            <Image
                                                src={calendar}
                                                alt="캘린더"
                                                fill
                                            />
                                            <div className="ml-auto w-4 h-4 text-xs relative text-center items-center z-5 rounded-full bg-red-500 text-white">
                                                {notification.calendaerCount > 99 ? "99+" : notification.calendaerCount}
                                            </div>
                                        </Link>
                                    </HoverCardTrigger>

                                    <HoverCardContent side="right" className="w-auto px-3 py-2">
                                        캘린더
                                    </HoverCardContent>
                                </HoverCard>

                                <HoverCard openDelay={200} closeDelay={100}>
                                    <HoverCardTrigger asChild>
                                        <Link
                                            href="/student/tutorial"
                                            aria-label="튜토리얼"
                                            className="h-14 w-14 rounded-2xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md relative"
                                        >
                                            <Image
                                                src={tutorial}
                                                alt="튜토리얼"
                                                fill
                                            />
                                        </Link>
                                    </HoverCardTrigger>

                                    <HoverCardContent side="left" className="w-auto px-3 py-2">
                                        튜토리얼
                                    </HoverCardContent>
                                </HoverCard>

                                <HoverCard openDelay={200} closeDelay={100}>
                                    <HoverCardTrigger asChild>
                                        <Link
                                            href="/student/phone/community"
                                            aria-label="커뮤니티"
                                            className="h-14 w-14 rounded-2xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md relative"
                                        >
                                            <Image
                                                src={community}
                                                alt="커뮤니티"
                                                fill
                                            />
                                            <div className="ml-auto w-4 h-4 text-xs relative text-center items-center z-5 rounded-full bg-red-500 text-white">
                                                {notification.communityCount > 99 ? "99+" : notification.communityCount}
                                            </div>
                                        </Link>
                                    </HoverCardTrigger>

                                    <HoverCardContent side="right" className="w-auto px-3 py-2">
                                        커뮤니티
                                    </HoverCardContent>
                                </HoverCard>
                            </div>
                        </main>

                        <footer className="pt-4 relative z-10 flex h-12 shrink-0 items-center justify-center">
                            <div className="h-1.5 w-24 rounded-full bg-slate-700/85 shadow-[0_1px_8px_rgba(255,255,255,0.45)]" />
                        </footer>
                    </div>
                </div>
            </div>
        </div >
    );
}
