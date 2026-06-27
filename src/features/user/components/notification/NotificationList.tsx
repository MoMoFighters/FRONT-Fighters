'use client'

import NotificationItem from "@/components/city/NotificationItem";
import { useEffect, useState } from "react";

import { getNoticeNotificationListAction } from "./action";
import { connectNoticeStomp } from "./stomp";
import { NoticeNotification } from "./type";

interface NotificationListProps {
    accessToken: string;
    onClose: () => void;
}

const getNotificationType = (
    notification: NoticeNotification
): "friend" | "calendar" | "community" => {
    switch (notification.type) {
        case "MESSAGE":
        case "FRIEND_REQUEST":
            return "friend";
        case "CALENDAR":
            return "calendar";
        case "COMMUNITY":
            return "community";
        default:
            return "community";
    }
};

export default function NotificationList({
    accessToken,
    onClose,
}: NotificationListProps) {
    const [notifications, setNotifications] = useState<NoticeNotification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadNotifications = async () => {
            const response = await getNoticeNotificationListAction();

            if (!isMounted) {
                return;
            }

            setNotifications(response.data ?? []);
            setIsLoading(false);
        };

        void loadNotifications();

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
                        "/user/sub/notice/list",
                        (body) => {
                            const data =
                                JSON.parse(body) as NoticeNotification[];

                            setNotifications(data);
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
        <div
            className="fixed right-0 top-0 h-screen w-screen"
            onClick={onClose}
        >
            <div
                className="fixed right-44 top-15 flex max-h-106 min-h-30 w-80 flex-col overflow-hidden rounded-xl border border-slate-300 bg-white/80 shadow-xl shadow-slate-900/10 backdrop-blur-md"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="rounded-t-xl border-b border-slate-500/30 px-5 py-3">
                    <h3 className="font-bold text-slate-800">
                        알림 목록
                    </h3>
                </div>

                <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex h-32 items-center justify-center text-sm font-bold text-slate-400">
                            알림을 불러오는 중입니다.
                        </div>
                    ) : notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                type={getNotificationType(notification)}
                                content={notification.message}
                                onClose={onClose}
                                isRead={notification.isRead}
                                targetId={notification.refId}
                            />
                        ))
                    ) : (
                        <div className="flex h-32 items-center justify-center text-sm font-bold text-slate-400">
                            알림이 없습니다.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
