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
import { connectNoticeStomp } from "./stomp";

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
                        className="relative mr-5 mb-1 h-4 w-4 cursor-pointer text-slate-500 hover:text-slate-700"
                        onClick={() => {
                            setHoverOpen(false);
                            setIsOpen((prev) => !prev);
                        }}
                    >
                        <Bell />
                        {notification > 0 && (
                            <p className="absolute -top-2.5 left-3.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-xs text-slate-200">
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
