"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Bell, BellOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import logo from "@/app/assets/img/logo.png";
import {
    getNoticeAppCountsAction,
    toggleNotificationAction,
} from "@/features/user/components/notification/action";
import { connectNoticeStomp } from "@/lib/stomp/stomp";
import { NoticeAppCountsData } from "@/features/user/components/notification/type";
import { toast } from "sonner";
import { getMyInfo } from "@/features/user/action";

interface PhoneProps {
    accessToken?: string;
    hasNotification?: boolean;
}

const EMPTY_COUNTS: NoticeAppCountsData = {
    totalMsgFriendCount: 0,
    calendarCount: 0,
    communityCount: 0,
};

const PhoneAppGridSkeleton = () => (
    <div className="grid grid-cols-2 gap-8">
        {Array.from({ length: 4 }, (_, index) => (
            <div
                key={index}
                className="h-14 w-14 animate-pulse rounded-2xl bg-slate-200/80 shadow-sm"
            />
        ))}
    </div>
);

const PhoneAppGrid = dynamic(() => import("./PhoneAppGrid"), {
    ssr: false,
    loading: () => <PhoneAppGridSkeleton />,
});


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
    const [shouldRenderAppGrid, setShouldRenderAppGrid] = useState(false);
    const hoverReleaseTimerRef = useRef<number | null>(null);
    const interactionLockTimerRef = useRef<number | null>(null);
    const appGridAreaRef = useRef<HTMLDivElement | null>(null);

    const hasNotificationValue =
        Object.values(notification).some((count) => count > 0);
    const notificationActive =
        notificationEnabled && (hasNotification || hasNotificationValue);
    const shouldVibrate =
        !isHovered &&
        !isInteractionLocked &&
        notificationActive;
    const renderedVibrationOffset = shouldVibrate
        ? vibrationOffset
        : { x: 0, y: 0 };

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

    const handleNotificationOnoff = async () => {
        const result = await toggleNotificationAction();

        if (result.status >= 400) {
            toast.error("알림 상태 변경 실패", {
                duration: 1000,
            });
            return;
        }

        toast.success("알림 상태 변경 성공", {
            duration: 1000,
        });
        keepPhoneStable();
        lockInteraction();
        setNotificationEnabled(result.data?.do_not_disturb === true);
    };

    useEffect(() => {
        let isMounted = true;


        const loadAppCounts = async () => {
            const notificationResponse = await getNoticeAppCountsAction();
            const dndResponse = await getMyInfo();

            if (!isMounted) {
                return;
            }

            setNotification(notificationResponse.data ?? EMPTY_COUNTS);
            setNotificationEnabled(dndResponse.data?.doNotDisturb || true)
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

    useEffect(() => {
        if (shouldRenderAppGrid || !appGridAreaRef.current) {
            return;
        }

        const target = appGridAreaRef.current;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldRenderAppGrid(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: "80px 0px",
                threshold: 0.15,
            }
        );

        observer.observe(target);

        return () => {
            observer.disconnect();
        };
    }, [shouldRenderAppGrid]);

    useEffect(() => {
        if (!shouldVibrate) {
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
                transform: `translate(${renderedVibrationOffset.x}px, ${renderedVibrationOffset.y}px)`,
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

                    <main className="z-10 flex min-h-0 flex-1 flex-col items-center justify-center gap-10 px-4">
                        <div className="relative h-5 w-30">
                            <Image
                                src={logo}
                                alt="MOMOCITY 로고"
                                fill
                                sizes="120px"
                                priority
                            />
                        </div>

                        <div ref={appGridAreaRef} className="min-h-[136px]">
                            {shouldRenderAppGrid ? (
                                <PhoneAppGrid notification={notification} />
                            ) : (
                                <PhoneAppGridSkeleton />
                            )}
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
