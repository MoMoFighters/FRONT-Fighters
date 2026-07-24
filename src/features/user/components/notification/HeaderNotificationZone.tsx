'use client'

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import NotificationList from "./NotificationList";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { getNoticeTotalCountsAction } from "./action";
import { connectNoticeStomp } from "../../../../lib/stomp/stomp";

interface HeaderNotificationZoneProps {
    accessToken: string;
}

export default function HeaderNotificationZone({
    accessToken,
}: HeaderNotificationZoneProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [hoverOpen, setHoverOpen] = useState(false);
    const [notification, setNotification] = useState(0);

    useEffect(() => {
        let isMounted = true;

        const loadCount = async () => {
            const response = await getNoticeTotalCountsAction();

            if (!isMounted) {
                return;
            }

            setNotification(response.data?.totalCount ?? 0);
        };

        void loadCount();

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
                        "/user/sub/notice/total-counts",
                        (body) => {
                            const data = JSON.parse(body) as {
                                totalCount?: number;
                            };

                            setNotification(data.totalCount ?? 0);
                        }
                    );
            },
        });

        return () => {
            subscription?.unsubscribe();
            client.disconnect();
        };
    }, [accessToken]);

    return (
        <>
            <HoverCard
                open={!isOpen && hoverOpen}
                onOpenChange={setHoverOpen}
                openDelay={50}
                closeDelay={50}
            >
                <HoverCardTrigger asChild>
                    <button
                        type="button"
                        className="relative mr-2 h-3.5 w-3.5 cursor-pointer text-slate-500 hover:text-slate-700 sm:mr-5 sm:h-4 sm:w-4"
                        onClick={() => {
                            setHoverOpen(false);
                            setIsOpen((prev) => !prev);
                        }}
                    >
                        <Bell className="h-full w-full" />
                        {notification > 0 && (
                            <p className="absolute -top-1 -right-1 flex h-3 min-w-3 items-center justify-center rounded-full bg-red-500 px-0.5 text-[9px] text-slate-200 sm:-top-1.5 sm:-right-1.5 sm:h-4 sm:min-w-4 sm:px-1 sm:text-xs">
                                {notification > 99 ? "99+" : notification}
                            </p>
                        )}
                    </button>
                </HoverCardTrigger>

                <HoverCardContent
                    side="bottom"
                    className="fixed top-4.5 -right-7 flex w-12 justify-center px-2 py-1"
                >
                    <div>
                        알림
                    </div>
                </HoverCardContent>
            </HoverCard>

            {isOpen && (
                <NotificationList
                    accessToken={accessToken}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
