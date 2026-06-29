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

import logo from "@/app/assets/img/logo.png";
import message from "@/app/assets/img/phone-message.png";
import calendar from "@/app/assets/img/phone-calendar.png";
import tutorial from "@/app/assets/img/phone-tutorial.png";
import community from "@/app/assets/img/phone-community.png";
import { getNoticeAppCountsAction, toggleNotificationAction } from "@/features/user/components/notification/action";
import { connectNoticeStomp } from "@/lib/stomp/stomp";
import { NoticeAppCountsData } from "@/features/user/components/notification/type";
import { toast } from "sonner";

interface PhoneProps {
    accessToken?: string;
    hasNotification?: boolean;
}

const EMPTY_COUNTS: NoticeAppCountsData = {
    totalMsgFriendCount: 0,
    calendarCount: 0,
    communityCount: 0,
};

const formatCount = (count: number) => (count > 99 ? "99+" : count);

export default function Phone({
    accessToken,
    hasNotification = false,
}: PhoneProps) {
    const [notificationEnabled, setNotificationEnabled] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [isInteractionLocked, setIsInteractionLocked] = useState(false);
    const [vibrationOffset, setVibrationOffset] = useState({ x: 0, y: 0 });
    const [notification, setNotification] =
        useState<NoticeAppCountsData>(EMPTY_COUNTS);
    const hoverReleaseTimerRef = useRef<number | null>(null);
    const interactionLockTimerRef = useRef<number | null>(null);

    const hasNotificationValue =
        Object.values(notification).some((count) => count > 0);
    const notificationActive =
        notificationEnabled && (hasNotification || hasNotificationValue);
    const shouldVibrate =
        !isHovered &&
        !isInteractionLocked &&
        notificationActive;


    const handleNotificationOnoff = async () => {
        const result = await toggleNotificationAction()
        if (result.status >= 400) {
            toast.error("알림 상태 변경 실패", {
                duration: 1000
            })
            return;
        }
        toast.success("알림 상태 변경 성공", {
            duration: 1000
        })
        keepPhoneStable();
        lockInteraction();
        setNotificationEnabled(result.data?.do_not_disturb === true);
    }

    useEffect(() => {
        let isMounted = true;

        const loadAppCounts = async () => {
            const response = await getNoticeAppCountsAction();

            if (!isMounted) {
                return;
            }
            setNotification(response.data ?? EMPTY_COUNTS);
            console.log(notification, "!!!");
        };

        void loadAppCounts();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (!accessToken) {
            return;
        }

        let subscription:
            | ReturnType<ReturnType<typeof connectNoticeStomp>["subscribe"]>
            | undefined;
        const client = connectNoticeStomp({
            accessToken,
            onConnect: (stompClient) => {
                subscription =
                    stompClient.subscribe(
                        "/user/sub/notice/app-counts",
                        (body) => {
                            const data =
                                JSON.parse(body) as Partial<NoticeAppCountsData>;

                            setNotification({
                                totalMsgFriendCount: data.totalMsgFriendCount ?? 0,
                                calendarCount: data.calendarCount ?? 0,
                                communityCount: data.communityCount ?? 0,
                            });
                        }
                    );
            },
        });

        return () => {
            subscription?.unsubscribe();
            client.disconnect();
        };
    }, [accessToken]);

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
            setVibrationOffset({ x: 0, y: 0 });
            return;
        }

        const vibrationPositions = [
            { x: -10, y: 0 },
            { x: 10, y: 0 },
            { x: 0, y: -10 },
            { x: 0, y: 10 },
            { x: 0, y: 0 },
        ];

        const intervalId = window.setInterval(() => {
            const randomPosition = vibrationPositions[
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
        <div
            className="group fixed -bottom-[320px] right-[8%] z-30 h-[440px] w-[230px] transition-[bottom] duration-500 ease-out hover:bottom-2 focus-within:bottom-4"
            onMouseEnter={keepPhoneStable}
            onMouseLeave={releasePhoneStable}
            onFocusCapture={keepPhoneStable}
            onBlurCapture={releasePhoneStable}
            style={{
                transform: `translate(${vibrationOffset.x}px, ${vibrationOffset.y}px)`,
            }}
        >

            <div className="relative h-full overflow-hidden rounded-[30px] border-[8px] border-slate-950 bg-slate-950 shadow-2xl">
                <div className="absolute left-1/2 top-2 z-30 h-3 w-15 -translate-x-1/2 rounded-full bg-slate-950" />

                <div className="relative flex h-full flex-col overflow-hidden rounded-[28px] bg-white">
                    <div className="absolute inset-0 bg-white" />

                    <header className="relative z-10 flex h-[76px] shrink-0 items-center justify-end px-5 pt-3">
                        <HoverCard openDelay={100} closeDelay={100}>
                            <HoverCardTrigger asChild>
                                <button
                                    type="button"
                                    aria-pressed={notificationEnabled}
                                    aria-label={notificationEnabled ? "알림 끄기" : "알림 켜기"}
                                    onClick={handleNotificationOnoff}
                                    className="relative flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/0 bg-white/0 text-slate-50 shadow-sm backdrop-blur-md transition-colors hover:bg-white hover:text-slate-900"
                                >
                                    {notificationEnabled ? (
                                        <Bell className="h-4 w-4 text-slate-500 hover:text-slate-700" />
                                    ) : (
                                        <BellOff className="h-4 w-4 text-slate-500 hover:text-slate-700" />
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
                                        href="/student/phone/friends"
                                        aria-label="메신저"
                                        className="h-14 w-14 rounded-2xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md relative"
                                    >
                                        <Image
                                            src={message}
                                            alt="메신저"
                                            fill
                                        />
                                        {notification.totalMsgFriendCount > 0 && (
                                            <div className="relative z-5 ml-auto h-4 w-4 items-center rounded-full bg-red-500 text-center text-xs text-white">
                                                {formatCount(notification.totalMsgFriendCount)}
                                            </div>
                                        )}
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
                                        {notification.calendarCount > 0 && (
                                            <div className="relative z-5 ml-auto h-4 w-4 items-center rounded-full bg-red-500 text-center text-xs text-white">
                                                {formatCount(notification.calendarCount)}
                                            </div>
                                        )}
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
                                        {notification.communityCount > 0 && (
                                            <div className="relative z-5 ml-auto h-4 w-4 items-center rounded-full bg-red-500 text-center text-xs text-white">
                                                {formatCount(notification.communityCount)}
                                            </div>
                                        )}
                                    </Link>
                                </HoverCardTrigger>

                                <HoverCardContent side="right" className="w-auto px-3 py-2">
                                    커뮤니티
                                </HoverCardContent>
                            </HoverCard>
                        </div>
                    </main>

                    <footer className="relative z-10 flex h-12 shrink-0 items-center justify-center pt-4">
                        <div className="h-1.5 w-24 rounded-full bg-slate-700/85 shadow-[0_1px_8px_rgba(255,255,255,0.45)]" />
                    </footer>
                </div>
            </div>
        </div>
    );
}
